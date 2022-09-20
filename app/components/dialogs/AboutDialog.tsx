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

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import semver from 'semver';
import LogoIcon from '-/assets/images/icon100x100.svg';
import i18n from '-/services/i18n';
import versionMeta from '-/version.json';
import { Pro } from '-/pro';
import { getLastVersionPromise } from '-/reducers/settings';
import DialogCloseButton from '-/components/dialogs/DialogCloseButton';
import Links from '-/links';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/styles/useTheme';

interface Props {
  open: boolean;
  openURLExternally: (url: string, skipConfirmation?: boolean) => void;
  toggleLicenseDialog: () => void;
  toggleThirdPartyLibsDialog: () => void;
  onClose: () => void;
}

let buildID = versionMeta.commitId;
if (buildID && buildID.length >= 11) {
  buildID = buildID.slice(0, 11);
}

const productName = versionMeta.name + (Pro ? ' Pro' : '');
document.title = productName + ' ' + versionMeta.version;

function AboutDialog(props: Props) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const { open, onClose } = props;

  function checkForUpdates() {
    if (updateAvailable) {
      props.openURLExternally(Links.links.downloadURL, true);
    } else {
      getLastVersionPromise()
        .then(lastVersion => {
          console.log('Last version on server: ' + lastVersion);
          const cleanedLastVersion = semver.coerce(lastVersion);
          // const cleanedCurrentVersion = '3.0.2'
          const cleanedCurrentVersion = semver.coerce(versionMeta.version);
          if (
            semver.valid(cleanedLastVersion) &&
            semver.gt(cleanedLastVersion, cleanedCurrentVersion)
          ) {
            setUpdateAvailable(true);
            setNewVersion(cleanedLastVersion.version);
          } else {
            setNewVersion(versionMeta.version);
          }
          return true;
        })
        .catch(error => {
          console.warn('Error while checking for update: ' + error);
        });
    }
  }

  let versionInfo = 'Check for updates';
  if (newVersion && newVersion.length > 1) {
    if (updateAvailable) {
      versionInfo = i18n.t('getNewVersion', { newVersion });
    } else {
      versionInfo = i18n.t('latestVersion', { productName });
    }
  }

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      keepMounted
      scroll="paper"
    >
      <DialogTitle>
        {productName}
        <DialogCloseButton onClose={onClose} />
      </DialogTitle>
      <DialogContent>
        <img
          alt="TagSpaces logo"
          src={LogoIcon}
          style={{ float: 'left', marginRight: 10, width: 120, height: 120 }}
        />
        <Tooltip
          arrow
          placement="top"
          title={
            'Build on: ' +
            versionMeta.buildTime +
            '\nPlatform: ' +
            navigator.userAgent
          }
        >
          <Typography variant="subtitle1">
            Version:&nbsp;
            {versionMeta.version}
            &nbsp;BuildID:&nbsp;
            {buildID}
          </Typography>
        </Tooltip>
        <br />
        <Typography id="aboutContent" variant="body1">
          <strong>
            {productName}
            &nbsp;
          </strong>
          is made possible by the TagSpaces project and other open source
          software listed in the:
          <br />
          <Button
            size="small"
            color="primary"
            style={{ marginLeft: -5 }}
            onClick={props.toggleThirdPartyLibsDialog}
          >
            Software Acknowledgements
          </Button>
          <br />
          {!Pro && (
            <span>
              This program is free software: you can redistribute it and/or
              modify it under the terms of the GNU Affero General Public License
              (version 3) as published by the Free Software Foundation.
            </span>
          )}
          <br />
          This program is distributed in the hope that it will be useful, but
          WITHOUT ANY WARRANTY; without even the implied warranty of
          MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the License
          for more details.
          <br />
          <br />
          <Button
            size="small"
            color="primary"
            onClick={() => {
              props.openURLExternally(Links.links.imprintURL, true);
            }}
          >
            Imprint
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              props.openURLExternally(Links.links.privacyURL, true);
            }}
          >
            Privacy Policy
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              props.openURLExternally(Links.links.changelogURL, true);
            }}
          >
            Changelog
          </Button>
          <Button
            size="small"
            color="primary"
            data-tid="openLicenseDialog"
            onClick={props.toggleLicenseDialog}
          >
            License Agreement
          </Button>
        </Typography>
      </DialogContent>
      <DialogActions>
        {!Pro && (
          <Button
            data-tid="checkForUpdates"
            title={i18n.t('core:checkForNewVersion')}
            onClick={() => {
              props.openURLExternally(Links.links.productsOverview, true);
            }}
            color="primary"
          >
            Upgrade to PRO
          </Button>
        )}
        <Button
          data-tid="checkForUpdates"
          title={i18n.t('core:checkForNewVersion')}
          onClick={checkForUpdates}
          color="primary"
        >
          {versionInfo}
        </Button>
        {/* <Button
        data-tid="openLicenseDialog"
        onClick={this.props.toggleLicenseDialog}
      >
        {i18n.t('core:license')}
      </Button>
      <Button
        data-tid="openThirdPartyLibsDialog"
        onClick={this.props.toggleThirdPartyLibsDialog}
      >
        {i18n.t('core:thirdPartyLibs')}
      </Button> */}
        <Button data-tid="closeAboutDialog" onClick={onClose} color="primary">
          {i18n.t('core:ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AboutDialog;
