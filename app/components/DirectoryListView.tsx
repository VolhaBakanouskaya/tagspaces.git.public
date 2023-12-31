import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@mui/material/Button';
import NewFolderIcon from '@mui/icons-material/CreateNewFolder';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import FolderIcon from '@mui/icons-material/FolderOpen';
import { locationType } from '@tagspaces/tagspaces-common/misc';
import { extractContainingDirectoryPath } from '@tagspaces/tagspaces-common/paths';
import { getShowUnixHiddenEntries } from '-/reducers/settings';
import AppConfig from '-/AppConfig';
import i18n from '-/services/i18n';
import { TS } from '-/tagspaces.namespace';
import { actions as AppActions, getCurrentLocationId } from '-/reducers/app';
import { ParentFolderIcon } from '-/components/CommonIcons';
import { getLocations } from '-/reducers/locations';
import PlatformIO from '-/services/platform-facade';

interface Props {
  setTargetDir: (dirPath: string) => void;
  locations: Array<TS.Location>;
  currentLocationId: string;
  toggleCreateDirectoryDialog: (props: any) => void;
  showUnixHiddenEntries: boolean;
}
function DirectoryListView(props: Props) {
  const { locations, currentLocationId, showUnixHiddenEntries } = props;
  const chosenLocationId = useRef<string>(currentLocationId);
  const chosenDirectory = useRef<string>();
  const [directoryContent, setDirectoryContent] = useState<
    TS.FileSystemEntry[]
  >([]);

  useEffect(() => {
    const chosenLocation = locations.find(
      location => location.uuid === chosenLocationId.current
    );
    if (chosenLocation) {
      listDirectory(chosenLocation.path);
    }
  }, [chosenLocationId.current]);

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    chosenLocationId.current = event.target.value;
    const chosenLocation = locations.find(
      location => location.uuid === chosenLocationId.current
    );
    if (chosenLocation) {
      listDirectory(chosenLocation.path);
    }
  };

  function getLocations() {
    const currentLocation = locations.find(
      location => location.uuid === chosenLocationId.current
    );
    if (currentLocation.type !== locationType.TYPE_LOCAL) {
      return null;
    }
    return (
      <Select
        onChange={handleLocationChange}
        fullWidth
        value={chosenLocationId.current}
      >
        {locations
          .filter(loc => loc.type === locationType.TYPE_LOCAL)
          .map((location: TS.Location) => (
            <MenuItem key={location.uuid} value={location.uuid}>
              <span style={{ width: '100%' }}>{location.name}</span>
            </MenuItem>
          ))}
      </Select>
    );
  }

  function listDirectory(directoryPath) {
    chosenDirectory.current = directoryPath;
    PlatformIO.listDirectoryPromise(
      directoryPath,
      [], // mode,
      []
    )
      .then(results => {
        if (results !== undefined) {
          setDirectoryContent(
            results.filter(entry => {
              return (
                !entry.isFile &&
                entry.name !== AppConfig.metaFolder &&
                !entry.name.endsWith('/' + AppConfig.metaFolder) &&
                !(!showUnixHiddenEntries && entry.name.startsWith('.'))
              );
            })
            // .sort((a, b) => b.name - a.name)
          );
          props.setTargetDir(directoryPath);
        }
        return true;
      })
      .catch(error => {
        console.error('listDirectoryPromise', error);
      });
  }

  function getFolderContent() {
    if (directoryContent && directoryContent.length > 0) {
      return directoryContent.map(entry => (
        <ListItem
          data-tid={'MoveTarget' + entry.name}
          title={'Navigate to: ' + entry.path}
          style={{ maxWidth: 250 }}
          onClick={() => {
            props.setTargetDir(entry.path);
          }}
          onDoubleClick={() => {
            listDirectory(entry.path);
          }}
        >
          <ListItemIcon style={{ minWidth: 35 }}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={entry.name} />
        </ListItem>
      ));
    }
    return (
      <div style={{ padding: 10 }}>{i18n.t('core:noSubFoldersFound')}</div>
    );
  }

  return (
    <div style={{ marginTop: 10 }}>
      {getLocations()}
      <Button
        variant="text"
        startIcon={<ParentFolderIcon />}
        style={{ margin: 5 }}
        onClick={() => {
          if (chosenDirectory.current) {
            let currentPath = chosenDirectory.current;
            if (currentPath.endsWith(PlatformIO.getDirSeparator())) {
              currentPath = currentPath.slice(0, -1);
            }
            listDirectory(extractContainingDirectoryPath(currentPath));
          }
        }}
      >
        {i18n.t('core:navigateToParentDirectory')}
      </Button>
      <Button
        variant="text"
        startIcon={<NewFolderIcon />}
        style={{ margin: 5 }}
        onClick={() => {
          props.toggleCreateDirectoryDialog({
            rootDirPath: chosenDirectory.current,
            callback: () => listDirectory(chosenDirectory.current),
            reflect: false
          });
        }}
      >
        {i18n.t('core:newSubdirectory')}
      </Button>
      <List
        dense
        style={{
          borderRadius: 5,
          maxHeight: 300,
          // @ts-ignore
          overflowY: AppConfig.isFirefox ? 'auto' : 'overlay'
        }}
      >
        {getFolderContent()}
      </List>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    locations: getLocations(state),
    currentLocationId: getCurrentLocationId(state),
    showUnixHiddenEntries: getShowUnixHiddenEntries(state)
  };
}

function mapActionCreatorsToProps(dispatch) {
  return bindActionCreators(
    {
      toggleCreateDirectoryDialog: AppActions.toggleCreateDirectoryDialog
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapActionCreatorsToProps
)(DirectoryListView);
