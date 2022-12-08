/**
 * TagSpaces - universal file and folder organizer
 * Copyright (C) 2017-present TagSpaces UG (haftungsbeschraenkt)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License (version 3) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/styles/useTheme';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { extend } from '@tagspaces/tagspaces-common/misc';
import AppConfig from '-/AppConfig';
import ConfirmDialog from '../ConfirmDialog';
import SettingsGeneral from '../settings/SettingsGeneral';
import SettingsKeyBindings from '../settings/SettingsKeyBindings';
import SettingsFileTypes from '../settings/SettingsFileTypes';
import i18n from '-/services/i18n';
import {
  actions,
  getCurrentLanguage,
  getSupportedFileTypes
} from '-/reducers/settings';
import { clearAllURLParams } from '-/utils/dom';
import SettingsAdvanced from '-/components/dialogs/settings/SettingsAdvanced';
import DialogCloseButton from '-/components/dialogs/DialogCloseButton';
import { getUuid } from '-/services/utils-io';
import Links from '-/content/links';

const styles: any = () => ({
  mainContent: {
    overflowY: AppConfig.isFirefox ? 'auto' : 'overlay'
  }
});

interface Props {
  open: boolean;
  classes?: any;
  onClose: () => void;
  setSupportedFileTypes?: (fileTypes: Array<any>) => void;
  openURLExternally: (url: string, skipConfirmation?: boolean) => void;
  supportedFileTypes?: Array<any>;
}

function SettingsDialog(props: Props) {
  const [items, setItems] = useStateWithCallbackLazy<Array<any>>([]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [isValidationInProgress, setIsValidationInProgress] = useState<boolean>(
    false
  );
  const [isConfirmDialogOpened, setIsConfirmDialogOpened] = useState<boolean>(
    false
  );
  const [
    isResetSettingsDialogOpened,
    setIsResetSettingsDialogOpened
  ] = useState<boolean>(false);
  const settingsFileTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSupportedFileTypes = props.supportedFileTypes.reduce(
      (accumulator, fileType) => {
        const modifiedFileType = extend({}, fileType, {
          id: fileType.id || getUuid()
        });
        if (fileType.viewer !== '') {
          accumulator.push(modifiedFileType);
        }
        return accumulator;
      },
      []
    );
    setItems(initSupportedFileTypes, undefined);
    setIsValidationInProgress(false);
  }, [props.supportedFileTypes]);

  const handleTabClick = (event, tab) => {
    setCurrentTab(tab);
  };

  const onAddFileType = (item = defaultFileTypeObject) => {
    setItems([...items, item], () => {
      if (settingsFileTypeRef && settingsFileTypeRef.current) {
        const lastFileType = settingsFileTypeRef.current.querySelector(
          'li:last-child'
        );
        lastFileType.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  const updateItems = (
    identifierKey,
    identifierValue,
    targetKey,
    targetValue,
    disableSave = false
  ) => {
    let isSaveable = false;
    let hasViewer = false;
    const modifiedItems = items.reduce((accumulator, item) => {
      let modifiedItem = extend({}, item);
      if (item[identifierKey] === identifierValue) {
        isSaveable = item.type !== '';
        hasViewer = item.viewer !== '';
        modifiedItem = extend(modifiedItem, {
          [targetKey]: targetValue
        });
      }
      accumulator.push(modifiedItem);
      return accumulator;
    }, []);

    setItems(modifiedItems, () => {
      if (
        (targetKey !== 'type' && isSaveable && !disableSave) ||
        (targetKey === 'type' && hasViewer && isSaveable && !disableSave)
      ) {
        saveFileTypes(modifiedItems);
      }
    });
  };

  const defaultFileTypeObject = {
    id: getUuid(),
    type: '',
    viewer: '',
    editor: '',
    color: '#2196f3'
  };

  const saveFileTypes = newItems => {
    const { setSupportedFileTypes } = props;

    setIsValidationInProgress(true);

    const isValid = validateSelectedFileTypes(newItems);

    if (!isValid) {
      return false;
    }

    setSupportedFileTypes(newItems);
  };

  const validateSelectedFileTypes = newItems => {
    let isValid = true;

    newItems.map(item => {
      const hasDuplicates =
        items.filter(targetItem => targetItem.type === item.type).length > 1;

      if (
        isValid &&
        (item.type === '' || item.viewer === '' || hasDuplicates)
      ) {
        isValid = false;
      }
      return item;
    });

    return isValid;
  };

  const removeItem = (itemForRemoval: any) => {
    const filteredItems = items.filter(
      item => item.type !== itemForRemoval.type
    );
    // setItems(filteredItems, undefined);
    saveFileTypes(filteredItems);
  };

  const renderTitle = () => (
    <>
      <DialogTitle>
        {i18n.t('core:settings')}
        <DialogCloseButton onClose={onClose} />
      </DialogTitle>
      <AppBar position="static" color="default">
        <Tabs
          value={currentTab}
          onChange={handleTabClick}
          indicatorColor="primary"
          scrollButtons="auto"
          variant="scrollable"
        >
          <Tab
            data-tid="generalSettingsDialog"
            label={i18n.t('core:generalTab')}
          />
          <Tab
            data-tid="fileTypeSettingsDialog"
            label={i18n.t('core:fileTypeTab')}
          />
          <Tab
            data-tid="keyBindingsSettingsDialog"
            label={i18n.t('core:keyBindingsTab')}
          />
          <Tab
            data-tid="advancedSettingsDialogTID"
            label={i18n.t('core:advancedSettingsTab')}
          />
        </Tabs>
      </AppBar>
    </>
  );

  const renderContent = () => (
    <DialogContent className={props.classes.mainContent}>
      {isConfirmDialogOpened && (
        <ConfirmDialog
          open={isConfirmDialogOpened}
          onClose={() => {
            setIsConfirmDialogOpened(false);
          }}
          title="Confirm"
          content={i18n.t('core:confirmFileTypeDeletion')}
          confirmCallback={result => {
            if (result) {
              removeItem(selectedItem);
            }
          }}
          cancelDialogTID="cancelDeleteFileTypeDialog"
          confirmDialogTID="confirmDeleteFileTypeDialog"
          confirmDialogContentTID="confirmDeleteFileTypeDialogContent"
        />
      )}

      {isResetSettingsDialogOpened && (
        <ConfirmDialog
          open={isResetSettingsDialogOpened}
          onClose={() => {
            setIsResetSettingsDialogOpened(false);
          }}
          title="Confirm"
          content={i18n.t('core:confirmResetSettings')}
          confirmCallback={result => {
            if (result) {
              clearAllURLParams();
              localStorage.clear();
              // eslint-disable-next-line no-restricted-globals
              location.reload();

              /* const electron = window.require('electron');
              const webContents = electron.remote.getCurrentWebContents();
              webContents.session.clearStorageData();
              webContents.reload(); */
            }
          }}
          cancelDialogTID="cancelResetSettingsDialogTID"
          confirmDialogTID="confirmResetSettingsDialogTID"
          confirmDialogContentTID="confirmResetSettingsDialogContentTID"
        />
      )}

      <div
        data-tid="settingsDialog"
        className={props.classes.mainContent}
        ref={settingsFileTypeRef}
      >
        {currentTab === 0 && <SettingsGeneral />}
        {currentTab === 1 && (
          <SettingsFileTypes
            items={items}
            selectedItem={selectedItem}
            setSelectedItem={item => setSelectedItem(item)}
            updateItems={updateItems}
            isValidationInProgress={isValidationInProgress}
            onRemoveItem={item => {
              setSelectedItem(item);
              setIsConfirmDialogOpened(true);
            }}
          />
        )}
        {currentTab === 2 && <SettingsKeyBindings />}
        {currentTab === 3 && (
          <SettingsAdvanced
            showResetSettings={setIsResetSettingsDialogOpened}
          />
        )}
      </div>
    </DialogContent>
  );

  const renderActions = () => (
    <DialogActions
      style={{
        justifyContent: currentTab === 1 ? 'space-between' : 'flex-end'
      }}
    >
      <Button
        onClick={() =>
          openURLExternally(Links.documentationLinks.settings, true)
        }
        color="secondary"
        style={{ float: 'left' }}
      >
        {i18n.t('core:help')}
      </Button>
      {currentTab === 1 && (
        <Button
          data-tid="addNewFileTypeTID"
          onClick={() => onAddFileType()}
          color="secondary"
          style={{ float: 'left' }}
        >
          {i18n.t('core:addNewFileType')}
        </Button>
      )}

      <Button
        data-tid="closeSettingsDialog"
        onClick={props.onClose}
        color="primary"
      >
        {i18n.t('core:closeButton')}
      </Button>
    </DialogActions>
  );

  const { open, onClose, openURLExternally } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      keepMounted
      scroll="paper"
      onClose={onClose}
    >
      {renderTitle()}
      {renderContent()}
      {renderActions()}
    </Dialog>
  );
}

const mapStateToProps = state => ({
  supportedFileTypes: getSupportedFileTypes(state),
  language: getCurrentLanguage(state)
});

const mapDispatchToProps = dispatch => ({
  setSupportedFileTypes: supportedFileTypes =>
    dispatch(actions.setSupportedFileTypes(supportedFileTypes))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SettingsDialog));
