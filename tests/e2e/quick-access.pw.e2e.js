/*
 * Copyright (c) 2016-present - TagSpaces UG (Haftungsbeschraenkt). All rights reserved.
 */
import {
  defaultLocationPath,
  defaultLocationName,
  createPwMinioLocation,
  createPwLocation
} from './location.helpers';
import { clickOn, expectElementExist, setInputKeys } from './general.helpers';
import { startTestingApp, stopSpectronApp, testDataRefresh } from './hook';
import { createSavedSearch } from './search.helpers';
import { openContextEntryMenu } from './test-utils';
import { dataTidFormat } from '../../app/services/test';

describe('TST09 - Quick access', () => {
  beforeAll(async () => {
    await startTestingApp();
  });

  afterAll(async () => {
    await stopSpectronApp();
    await testDataRefresh();
  });
  beforeEach(async () => {
    if (global.isMinio) {
      await createPwMinioLocation('', defaultLocationName, true);
    } else {
      await createPwLocation(defaultLocationPath, defaultLocationName, true);
    }
    await clickOn('[data-tid=location_' + defaultLocationName + ']');
    // If its have opened file
    // await closeFileProperties();
  });

  test('TST0901 - Create, rename and delete stored search [electron,_pro]', async () => {
    const storedSearchTitle = 'jpgSearch';
    await createSavedSearch({ title: storedSearchTitle, textQuery: 'jpg' });
    //await expectElementExist('[data-tid=quickAccessButton]');
    await clickOn('[data-tid=quickAccessButton]');
    // await clickOn('[data-tid=storedSearchesVisibleTID]');
    await expectElementExist(
      '[data-tid=StoredSearchTID' + storedSearchTitle + ']'
    );
    // Rename
    await clickOn('[data-tid=editSearchTID]');
    await setInputKeys('savedSearchTID', 'Renamed');
    await clickOn('[data-tid=confirmSavedSearchTID]');
    await expectElementExist(
      '[data-tid=StoredSearchTID' + storedSearchTitle + 'Renamed]'
    );
    //Delete
    await clickOn('[data-tid=editSearchTID]');
    await clickOn('[data-tid=deleteSavedSearchTID]');
    await expectElementExist(
      '[data-tid=StoredSearchTID' + storedSearchTitle + 'Renamed]',
      false
    );
  });

  test('TST0902 - Create, execute and delete stored search [electron,_pro]', async () => {
    const storedSearchTitle = 'jpgExecutedSearch';
    const textQuery = 'jpg';
    await createSavedSearch({ title: storedSearchTitle, textQuery });
    //await expectElementExist('[data-tid=quickAccessButton]');
    await clickOn('[data-tid=quickAccessButton]');
    // await clickOn('[data-tid=storedSearchesVisibleTID]');
    await expectElementExist(
      '[data-tid=StoredSearchTID' + storedSearchTitle + ']'
    );
    // Execute
    await clickOn('[data-tid=StoredSearchTID' + storedSearchTitle + ']');
    const inputValue = await global.client.inputValue('#textQuery');
    expect(inputValue).toBe(textQuery);
    //Delete
    await clickOn('[data-tid=editSearchTID]');
    await clickOn('[data-tid=deleteSavedSearchTID]');
    await expectElementExist(
      '[data-tid=StoredSearchTID' + storedSearchTitle + ']',
      false
    );
  });

  test('TST0905 - Create, open and remove bookmark to file in properties [electron,web,_pro]', async () => {
    const bookmarkFileTitle = 'sample.txt';
    const bookmarkFileTid = dataTidFormat(bookmarkFileTitle);
    await openContextEntryMenu(
      '[data-tid="fsEntryName_' + bookmarkFileTitle + '"]', // todo rethink selector here contain dot
      'fileMenuOpenFile'
    );

    // Create
    await clickOn('[data-tid=toggleBookmarkTID]');
    await clickOn('[data-tid=fileContainerCloseOpenedFile]');

    // Open
    await clickOn('[data-tid=quickAccessButton]');
    await expectElementExist(
      '[data-tid=tsBookmarksTID' + bookmarkFileTid + ']'
    );
    await clickOn('[data-tid=tsBookmarksTID' + bookmarkFileTid + ']');
    await expectElementExist('[data-tid=OpenedTID' + bookmarkFileTid + ']');

    //Delete
    await clickOn('[data-tid=toggleBookmarkTID]');
    await clickOn('[data-tid=BookmarksMenuTID]');
    await clickOn('[data-tid=refreshBookmarksTID]');

    await expectElementExist(
      '[data-tid=tsBookmarksTID' + bookmarkFileTid + ']',
      false
    );
  });

  test('TST0906 - Create, open and remove bookmark to folder in quickaccess [electron,web,_pro]', async () => {
    const testFolder = 'empty_folder';
    await global.client.dblclick('[data-tid=fsEntryName_' + testFolder + ']');
    await clickOn('[data-tid=folderContainerOpenDirMenu]');
    await clickOn('[data-tid=showProperties]');

    // Create
    await clickOn('[data-tid=toggleBookmarkTID]');
    await clickOn('[data-tid=fileContainerCloseOpenedFile]');

    // Open
    await clickOn('[data-tid=quickAccessButton]');
    await expectElementExist('[data-tid=tsBookmarksTID' + testFolder + ']');
    await clickOn('[data-tid=tsBookmarksTID' + testFolder + ']');
    await clickOn('[data-tid=folderContainerOpenDirMenu]');
    await clickOn('[data-tid=showProperties]');
    await expectElementExist('[data-tid=OpenedTID' + testFolder + ']');

    //Delete
    await clickOn('[data-tid=toggleBookmarkTID]');
    await clickOn('[data-tid=BookmarksMenuTID]');
    await clickOn('[data-tid=refreshBookmarksTID]');

    await expectElementExist(
      '[data-tid=tsBookmarksTID' + testFolder + ']',
      false
    );
  });

  test('TST0907 - Create 2 local bookmarks and delete all bookmarks [electron,_pro]', async () => {
    await clickOn('[data-tid=quickAccessButton]');
    const bookmarks = ['sample.txt', 'sample.jpg'];
    for (let i = 0; i < bookmarks.length; i++) {
      await openContextEntryMenu(
        '[data-tid="fsEntryName_' + bookmarks[i] + '"]',
        'fileMenuOpenFile'
      );

      // Create
      await clickOn('[data-tid=toggleBookmarkTID]');
      await clickOn('[data-tid=fileContainerCloseOpenedFile]');
      // Refresh bookmarks
      await clickOn('[data-tid=BookmarksMenuTID]');
      await clickOn('[data-tid=refreshBookmarksTID]');

      await expectElementExist(
        '[data-tid=tsBookmarksTID' + dataTidFormat(bookmarks[i]) + ']'
      );
    }

    // Delete All bookmarks
    await clickOn('[data-tid=BookmarksMenuTID]');
    await clickOn('[data-tid=clearBookmarksTID]');
    for (let i = 0; i < bookmarks.length; i++) {
      await expectElementExist(
        '[data-tid=tsBookmarksTID' + dataTidFormat(bookmarks[i]) + ']',
        false
      );
    }
  });
  test('TST0908 - Add, open and remove recently opened file [web,electron,_pro]', async () => {
    // Add
    const fileTitle = 'sample.jpg';
    const fileTid = dataTidFormat(fileTitle);
    await openContextEntryMenu(
      '[data-tid="fsEntryName_' + fileTitle + '"]', // todo rethink selector here contain dot
      'fileMenuOpenFile'
    );
    await clickOn('[data-tid=fileContainerCloseOpenedFile]');

    // Open
    await clickOn('[data-tid=quickAccessButton]');
    await clickOn('[data-tid=fileOpenHistoryTID]');
    await expectElementExist(
      '[data-tid=tsLastOpenedFilesHistoryTID' + fileTid + ']'
    );
    await clickOn('[data-tid=tsLastOpenedFilesHistoryTID' + fileTid + ']');
    await expectElementExist('[data-tid=OpenedTID' + fileTid + ']');

    //Delete
    await clickOn('[data-tid=fileOpenMenuTID]');
    await clickOn('[data-tid=clearHistoryTID]');
    await expectElementExist(
      '[data-tid=tsLastOpenedFilesHistoryTID' + fileTid + ']',
      false
    );
  });

  test('TST0909 - Add 2 recently opened files and clear history [electron,_pro]', async () => {
    await clickOn('[data-tid=quickAccessButton]');
    await clickOn('[data-tid=fileOpenHistoryTID]');

    const files = ['sample.txt', 'sample.jpg'];
    for (let i = 0; i < files.length; i++) {
      // Add
      const fileTid = dataTidFormat(files[i]);
      await openContextEntryMenu(
        '[data-tid="fsEntryName_' + files[i] + '"]',
        'fileMenuOpenFile'
      );
      await clickOn('[data-tid=fileContainerCloseOpenedFile]');
      // Refresh opened files
      await clickOn('[data-tid=fileOpenMenuTID]');
      await clickOn('[data-tid=refreshHistoryTID]');
      await expectElementExist(
        '[data-tid=tsLastOpenedFilesHistoryTID' + fileTid + ']'
      );
    }

    // Delete All bookmarks
    await clickOn('[data-tid=fileOpenMenuTID]');
    await clickOn('[data-tid=clearHistoryTID]');
    for (let i = 0; i < files.length; i++) {
      await expectElementExist(
        '[data-tid=tsLastOpenedFilesHistoryTID' + dataTidFormat(files[i]) + ']',
        false
      );
    }
  });
});
