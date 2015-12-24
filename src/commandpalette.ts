/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use-strict';

import * as arrays
  from 'phosphor-arrays';

import {
  ICommand
} from 'phosphor-command';

import {
  IDisposable, DisposableDelegate
} from 'phosphor-disposable';

import {
  Message
} from 'phosphor-messaging';

import {
  ISignal, Signal
} from 'phosphor-signaling';

import {
Panel
} from 'phosphor-widget';

import {
  ICommandItem
} from './commands/registry';

import './commandpalette.css';


const COMMAND_ID = 'data-command-id';

const PALETTE_CLASS = 'p-Command-Palette';

const HEADER_CLASS = 'p-header';

const COMMAND_CLASS = 'p-command';

const DESCRIPTION_CLASS = 'p-description';

const SHORTCUT_CLASS = 'p-shortcut';

const SEARCH_CLASS = 'p-search';

const UP_ARROW = 38;

const DOWN_ARROW = 40;

/**
 * An object which can be added to a command palette section.
 */
export
interface ICommandPaletteItem {
  /**
   * The unique id for the command.
   */
  id: string;

  /**
   * The arguments the command will be called with.
   */
  args?: any;

  /**
   * The shortcut for the command.
   */
  shortcut?: string;

  /**
   * The title of the command.
   */
  title: string;

  /**
   * A descriptive caption for the command.
   */
  caption?: string;
}

/**
 * A group of items that can added to a command palette with headings.
 */
export
interface ICommandPaletteSection {
  id: string;
  heading: string;
  items: ICommandPaletteItem[];
};

// export
// interface ICommandSearchQuery {
//   id: number;
//   query: string;
// }

// export
// interface ICommandSectionHeading {
//   prefix: string;
//   title: string;
// };


export
class CommandPalette extends Panel {

  constructor() {
    super();
    this.addClass(PALETTE_CLASS);
    this._renderSearch();
    this._renderList();
  }

  add(section: ICommandPaletteSection): IDisposable {
    let exists = !!~arrays.findIndex(this._sections, s => s.id === section.id);
    if (exists) {
      throw new Error(`${section.id} already exists in command palette`);
    }
    let index = this._sections.push(section) - 1;
    this._renderSection(section);
    return new DisposableDelegate(() => {
      arrays.removeAt(this._sections, index);
      this._emptyList();
      this._sections.forEach(section => this._renderSection(section));
    });
  }

  handleEvent(event: Event): void {
    switch (event.type) {
    case 'click':
      this._evtClick(event as MouseEvent);
      break;
    case 'keydown':
      this._evtKeyDown(event as KeyboardEvent);
      break;
    }
  }

  protected onAfterAttach(msg: Message): void {
    this.node.addEventListener('click', this);
    this.node.addEventListener('keydown', this);
  }

  protected onBeforeDetach(msg: Message): void {
    this.node.removeEventListener('click', this);
    this.node.removeEventListener('keydown', this);
  }

  private _emptyList(): void {
    let list = this._list;
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  private _findCommandItemById(id: string): ICommandPaletteItem {
    for (let i = 0; i < this._sections.length; ++i) {
      let section = this._sections[i];
      for (let j = 0; j < section.items.length; ++j) {
        let item = section.items[j];
        if (item.id === id) {
          return item;
        }
      }
    }
    return null;
  }

  private _evtClick(event: MouseEvent): void {
    let { altKey, ctrlKey, metaKey, shiftKey } = event;
    if (event.button !== 0 || altKey || ctrlKey || metaKey || shiftKey) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    let target: HTMLElement = event.target as HTMLElement;
    while (!target.hasAttribute(COMMAND_ID)) {
      if (target === this.node as HTMLElement) {
        return;
      }
      target = target.parentElement;
    }
    let item = this._findCommandItemById(target.getAttribute(COMMAND_ID));
    console.log(`run command ${item.id} with args:`, item.args);
  }

  private _evtKeyDown(event: KeyboardEvent): void {
    let { altKey, ctrlKey, metaKey, keyCode } = event;
    let input = (this._search.querySelector('input') as HTMLInputElement);
    if (keyCode !== UP_ARROW && keyCode !== DOWN_ARROW) {
      let oldValue = input.value;
      requestAnimationFrame(() => {
        let newValue = input.value;
        if (newValue !== oldValue) {
          console.log('search for:', newValue);
        }
      });
      return;
    }
    // Ignore keyboard shortcuts that include up and down arrow.
    if (altKey || ctrlKey || metaKey) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (keyCode === UP_ARROW) {
      console.log('go up');
      return;
    }
    if (keyCode === DOWN_ARROW) {
      console.log('go down');
      return;
    }
  }

  private _renderCommandItem(item: ICommandPaletteItem): void {
    let command = document.createElement('div');
    let description = document.createElement('div');
    let shortcut = document.createElement('div');
    command.classList.add(COMMAND_CLASS);
    description.classList.add(DESCRIPTION_CLASS);
    shortcut.classList.add(SHORTCUT_CLASS);
    command.textContent = item.title;
    if (item.caption) {
      description.textContent = item.caption;
    }
    if (item.shortcut) {
      shortcut.textContent = item.shortcut;
    }
    command.appendChild(shortcut);
    command.appendChild(description);
    command.setAttribute(COMMAND_ID, item.id);
    this._list.appendChild(command);
  }

  private _renderHeading(heading: string): void {
    let header = document.createElement('div');
    header.classList.add(HEADER_CLASS);
    header.appendChild(document.createTextNode(heading));
    header.appendChild(document.createElement('hr'));
    this._list.appendChild(header);
  }

  private _renderList(): void {
    this._list = document.createElement('div');
    this.node.appendChild(this._list);
  }

  private _renderSearch(): void {
    let input = document.createElement('input');
    this._search = document.createElement('div');
    this._search.classList.add(SEARCH_CLASS);
    this._search.appendChild(input);
    this.node.appendChild(this._search);
  }

  private _renderSection(section: ICommandPaletteSection): void {
    this._renderHeading(section.heading);
    section.items.forEach(item => { this._renderCommandItem(item); });
  }

  private _sections: ICommandPaletteSection[] = [];
  private _list: HTMLDivElement = null;
  private _search: HTMLDivElement = null;
}
