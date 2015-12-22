/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use-strict';

import {
  DelegateCommand, ICommand
} from 'phosphor-command';

import {
Message
} from 'phosphor-messaging';

import {
BoxPanel
} from 'phosphor-boxpanel';

import {
Panel, Widget
} from 'phosphor-widget';

import {
  DockPanel
} from 'phosphor-dockpanel';

import {
  createStatus, updateStatus
} from './status';

import {
  CommandPalette, ICommandSection, ICommandSectionHeading, ICommandSearchQuery
} from './commandpalette';

import {
  CommandRegistry, ICommandItem
} from './commands/registry';

import {
  FuzzyMatcher, ICommandMatchResult
} from './commands/matcher';

import './index.css';


const INSTRUCTIONS = 'Check out the command palette';

const registry = CommandRegistry.instance();

const matcher = new FuzzyMatcher('title', 'caption');

const headings: ICommandSectionHeading[] = [
  { prefix: 'demo:nes', title: 'The Ancient Near East' },
  { prefix: 'demo:foobar', title: 'Foo, bar, and friends' }
];

const commandItems: ICommandItem[] = [
  {
    id: 'demo:nes:sumer',
    title: 'Show Sumer',
    caption: 'The city-state of Sumer',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Sumer'); })
  },
  {
    id: 'demo:nes:babylon',
    title: 'Show Babylon',
    caption: 'The Babylonian empire',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Babylon'); })
  },
  {
    id: 'demo:nes:oldking',
    title: 'Show Old Kingdom',
    caption: 'The Old Kingdom of Egypt',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Old Kingdom'); })
  },
  {
    id: 'demo:nes:tyre',
    title: 'Show Tyre',
    caption: 'The city-state of Tyre',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Tyre'); })
  },
  {
    id: 'demo:nes:hittite',
    title: 'Show Hittite empire',
    caption: 'The Hittite empire',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Hittites'); })
  },
  {
    id: 'demo:nes:parthia',
    title: 'Show Parthia',
    caption: 'The Hellenistic kingdom of Parthia',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Parthia'); })
  },
  {
    id: 'demo:nes:neobab',
    title: 'Show Neo-Babylonia',
    caption: 'The Neo-Babylonian empire',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Neo Babylonia'); })
  },
  {
    id: 'demo:foobar:foo',
    title: 'Foo',
    caption: 'Foo caption',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Foo'); })
  },
  {
    id: 'demo:foobar:bar',
    title: 'Bar',
    caption: 'Bar caption',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Bar'); })
  },
  {
    id: 'demo:foobar:baz',
    title: 'Baz',
    caption: 'Baz caption',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Baz'); })
  },
  {
    id: 'demo:foobar:qux',
    title: 'Qux',
    caption: 'Qux caption',
    shortcut: '⌘⎋',
    command: new DelegateCommand(() => { window.alert('Qux'); })
  }
];

function createDock(): DockPanel {
  let dock = new DockPanel();
  dock.addClass('D-Dock');
  return dock;
}

function createHeader(): Widget {
  let header = new Widget();
  let lightbulb = document.createElement('i');
  lightbulb.classList.add('fa');
  lightbulb.classList.add('fa-lightbulb-o');
  header.addClass('D-Header');
  header.node.appendChild(lightbulb);
  header.node.appendChild(document.createTextNode(` ${INSTRUCTIONS}`));
  BoxPanel.setSizeBasis(header, 20);
  BoxPanel.setStretch(header, 0);
  return header;
}

function createPalette(): Panel {
  let palette = new CommandPalette();
  palette.headings = headings;
  palette.commandItems = commandItems;
  palette.execute.connect((sender, args) => {
    let command = args as ICommand;
    updateStatus('execute signal');
    command.execute(void 0);
  });
  palette.search.connect((sender, args) => {
    let search = args as ICommandSearchQuery;
    updateStatus(`searching, id: ${search.id}, query: ${search.query}`);
    if (search.query === '') {
      palette.commandItems = commandItems;
      return;
    }
    function resolve(results: ICommandMatchResult[]):void {
      let commandItems = results.map(value => value.command);
      palette.commandItems = commandItems;
    }
    function reject(error: any): void {
      palette.commandItems = [];
    }
    matcher.search(search.query, commandItems).then(resolve, reject);
  });
  return palette;
}

function createPanel(header: Widget, list: Panel, dock: DockPanel, status: Widget): BoxPanel {
  let panel = new BoxPanel();
  let subpanel = new BoxPanel();

  subpanel.direction = BoxPanel.LeftToRight;
  subpanel.children.assign([list, dock]);
  subpanel.spacing = 0;
  BoxPanel.setSizeBasis(list, 150);
  BoxPanel.setStretch(list, 0);

  panel.children.assign([header, subpanel, status]);
  panel.spacing = 0;
  panel.direction = BoxPanel.TopToBottom;

  panel.id = 'main';
  return panel;
}

function main(): void {
  registry.add(commandItems);
  let header = createHeader();
  let palette = createPalette();
  let dock = createDock();
  let status = createStatus();
  let panel = createPanel(header, palette, dock, status);
  Widget.attach(panel, document.body);
  window.onresize = () => panel.update();
}

window.addEventListener('load', main);
