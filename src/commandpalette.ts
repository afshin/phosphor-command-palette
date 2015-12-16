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
  ISignal, Signal
} from 'phosphor-signaling';

import {
Panel
} from 'phosphor-widget';

import {
  updateStatus
} from './status';

import './commandpalette.css';


const COMMAND_ID = 'data-command-id';

const PALETTE_CLASS = 'p-Command-Palette';

const HEADER_CLASS = 'p-header';

const COMMAND_CLASS = 'p-command';

const DESCRIPTION_CLASS = 'p-description';

const SHORTCUT_CLASS = 'p-shortcut';

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
interface ICommandSection {
  header: string;
  specs: ICommandSpec[];
};

export
class CommandPalette extends Panel {

  static executeSignal = new Signal<CommandPalette, string>();

  get execute(): ISignal<CommandPalette, string> {
    return CommandPalette.executeSignal.bind(this);
  }

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

  private _evtClick(event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey) {
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
    this.execute.emit(target.getAttribute(COMMAND_ID));
  }

  private _evtKeyDown(event: KeyboardEvent): void {
    console.log('keydown');
  }

  private _emptyList(): void {
    let list = this._list;
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  private _renderCommandSpec(spec: ICommandSpec): void {
    let command = document.createElement('div');
    let description = document.createElement('div');
    let shortcut = document.createElement('div');
    command.classList.add(COMMAND_CLASS);
    description.classList.add(DESCRIPTION_CLASS);
    shortcut.classList.add(SHORTCUT_CLASS);
    command.textContent = spec.command.caption;
    description.textContent = spec.originalText;
    shortcut.textContent = '⌘⌘';
    command.appendChild(shortcut);
    command.appendChild(description);
    command.setAttribute(COMMAND_ID, spec.command.id);
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
