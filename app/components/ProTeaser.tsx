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

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ProTeaserImage from '-/assets/images/pro-teaser.svg';
import ProTextLogo from '-/assets/images/text-logo-pro.svg';
import i18n from '../services/i18n';
import Links from '-/content/links';

interface Props {
  toggleProTeaser: (slidePage?: string) => void;
  setShowTeaserBanner: (teaserVisibility: boolean) => void;
  openURLExternally: (url: string, skipConfirmation?: boolean) => void;
}

function ProTeaser(props: Props) {
  const { toggleProTeaser, setShowTeaserBanner, openURLExternally } = props;
  return (
    <>
      <CardContent
        onClick={() => toggleProTeaser()}
        style={{
          padding: 5,
          paddingBottom: 0,
          textAlign: 'center'
        }}
      >
        <Typography color="textSecondary" variant="caption">
          achieve more with
          <IconButton
            style={{ right: 5, marginTop: -10, position: 'absolute' }}
            size="small"
            aria-label="close"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              setShowTeaserBanner(false);
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Typography>
        <br />
        <img style={{ height: 35 }} src={ProTextLogo} alt="" />
        <br />
        <img style={{ maxHeight: 60 }} src={ProTeaserImage} alt="" />
      </CardContent>
      <CardActions
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: -10
        }}
      >
        <Button
          size="small"
          onClick={(event: any) => {
            event.preventDefault();
            event.stopPropagation();
            toggleProTeaser();
          }}
        >
          {i18n.t('showMeMore')}
        </Button>
        <Button
          size="small"
          onClick={(event: any) => {
            event.preventDefault();
            event.stopPropagation();
            openURLExternally(Links.links.productsOverview, true);
          }}
        >
          {i18n.t('getItNow')}
        </Button>
      </CardActions>
    </>
  );
}

export default ProTeaser;
