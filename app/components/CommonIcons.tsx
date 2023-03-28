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

import React from 'react';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

export const ParentFolderIcon = props => (
  <KeyboardReturnIcon style={{ transform: 'rotate(90deg)' }} />
  // <ParentFolder {...props} />
);

export const NavigateToFolderIcon = props => <KeyboardReturnIcon />;

export { default as InfoTooltipIcon } from '@mui/icons-material/InfoOutlined';

export { default as FolderIcon } from '@mui/icons-material/Folder';

export { default as FileIcon } from '@mui/icons-material/InsertDriveFile';

export { default as MainMenuIcon } from '@mui/icons-material/Menu';

export { default as GoBackIcon } from '@mui/icons-material/ArrowBack';

export { default as GoForwardIcon } from '@mui/icons-material/ArrowForward';

export { default as HelpIcon } from '@mui/icons-material/Help';

export { default as InfoIcon } from '@mui/icons-material/AnnouncementOutlined';

export { default as FolderPropertiesIcon } from '@mui/icons-material/Info';

export { default as RemoveIcon } from '@mui/icons-material/Remove';

export { default as HistoryIcon } from '@mui/icons-material/History';

export { default as PerspectiveSettingsIcon } from '@mui/icons-material/Settings';

export { default as CreateFileIcon } from '@mui/icons-material/Add';

export { default as LocalLocationIcon } from '@mui/icons-material/WorkOutline';

export { default as OpenLinkIcon } from '@mui/icons-material/Link';

export { default as KeyShortcutsIcon } from '@mui/icons-material/Keyboard';

export { default as CancelIcon } from '@mui/icons-material/Cancel';
