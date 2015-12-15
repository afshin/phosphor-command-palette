/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use-strict';

import {
Message
} from 'phosphor-messaging';

import {
Panel
} from 'phosphor-widget';

import {
  updateStatus
} from './status';

import './commandpalette.css';


const PALETTE_CLASS = 'p-Command-Palette';

const HEADER_CLASS = 'p-header';

const COMMAND_CLASS = 'p-command';

const SEARCH_CLASS = 'p-search';

export
interface ICommandSpec {
  score?: number;
  originalText: string;
  command: {
    id: string;
    caption: string;
  }
}

export
interface ICommandSection { header: string, specs: ICommandSpec[] };

export
class CommandPalette extends Panel {

  get commands(): ICommandSection[] {
    return this._commands;
  }

  set commands(commands: ICommandSection[]) {
    this._commands = commands;
    this._emptyList();
    this._commands.forEach(section => { this._renderSection(section); });
  }

  constructor() {
    super();
    this.addClass(PALETTE_CLASS);
    this._renderSearch();
    this._renderList();
  }

  private _emptyList(): void {
    let list = this._list;
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  private _renderCommandSpec(spec: ICommandSpec): void {
    let command = document.createElement('div');
    command.classList.add(COMMAND_CLASS);
    command.appendChild(document.createTextNode(spec.command.caption));
    this.node.appendChild(command);
  }

  private _renderHeader(title: string): void {
    let header = document.createElement('div');
    header.classList.add(HEADER_CLASS);
    header.appendChild(document.createTextNode(title));
    header.appendChild(document.createElement('hr'));
    this.node.appendChild(header);
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

  private _renderSection(section: ICommandSection): void {
    this._renderHeader(section.header);
    section.specs.forEach(spec => { this._renderCommandSpec(spec); });
  }

  private _commands: ICommandSection[] = null;
  private _list: HTMLDivElement = null;
  private _search: HTMLDivElement = null;
}
