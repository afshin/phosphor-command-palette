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
  CommandPalette, ICommandPaletteItem, ICommandPaletteSection
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

const registryItems: ICommandItem[] = [
  { id: 'demo:nes:sumer', command: createCommand('Sumer') },
  { id: 'demo:nes:babylon', command: createCommand('Babylon') },
  { id: 'demo:nes:oldking', command: createCommand('Old Kingdom Egypt') },
  { id: 'demo:nes:tyre', command: createCommand('Tyre') },
  { id: 'demo:nes:hittite', command: createCommand('Hittite Empire') },
  { id: 'demo:nes:parthia', command: createCommand('Parthian Empire') },
  { id: 'demo:nes:neobab', command: createCommand('Neo-Babylonian Empire') },
  { id: 'demo:foobar:foo', command: createCommand('Foo') },
  { id: 'demo:foobar:bar', command: createCommand('Bar') },
  { id: 'demo:foobar:baz', command: createCommand('Baz') },
  { id: 'demo:foobar:qux', command: createCommand('Qux') }
]

const nesSection: ICommandPaletteSection = {
  text: 'The Ancient Near East',
  items: [
    {
      id: 'demo:nes:sumer',
      title: 'Show Sumer',
      caption: 'The city-state of Sumer',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:nes:babylon',
      title: 'Show Babylon',
      caption: 'The Babylonian empire',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:nes:oldking',
      title: 'Show Old Kingdom',
      caption: 'The Old Kingdom of Egypt',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:nes:tyre',
      title: 'Show Tyre',
      caption: 'The city-state of Tyre',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:nes:hittite',
      title: 'Show Hittite empire',
      caption: 'The Hittite empire',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:nes:parthia',
      title: 'Show Parthia',
      caption: 'The Hellenistic kingdom of Parthia',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:nes:neobab',
      title: 'Show Neo-Babylonia',
      caption: 'The Neo-Babylonian empire',
      shortcut: '⌘⎋'
    }
  ] as ICommandPaletteItem[]
};

const fooSection: ICommandPaletteSection = {
  text: 'Foo, bar, and friends',
  items: [
    {
      id: 'demo:foobar:foo',
      args: ['a', 'b', 'c'],
      title: 'Foo',
      caption: 'Foo caption',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:foobar:bar',
      title: 'Bar',
      caption: 'Bar caption',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:foobar:baz',
      title: 'Baz',
      caption: 'Baz caption',
      shortcut: '⌘⎋'
    },
    {
      id: 'demo:foobar:qux',
      title: 'Qux',
      caption: 'Qux caption',
      shortcut: '⌘⎋'
    }
  ] as ICommandPaletteItem[]
};

function createCommand(message: string): ICommand {
  return new DelegateCommand(() => { console.log(`COMMAND: ${message}`); });
}

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
  // Returns an IDisposable to allow for removal.
  palette.add([nesSection, fooSection]);
  // Duplicate section won't render.
  palette.add([fooSection]);
  palette.add([
    {
      text: 'Alphabet',
      items: [{ id: 'demo:abc:a', title: 'A', caption: 'The letter A'}]
    }
  ]);
  // palette.execute.connect((sender, args) => {
  //   let command = args as ICommand;
  //   updateStatus('execute signal');
  //   command.execute(void 0);
  // });
  // palette.search.connect((sender, args) => {
  //   let search = args as ICommandSearchQuery;
  //   updateStatus(`searching, id: ${search.id}, query: ${search.query}`);
  //   if (search.query === '') {
  //     palette.commandItems = commandItems;
  //     return;
  //   }
  //   function resolve(results: ICommandMatchResult[]):void {
  //     let commandItems = results.map(value => value.command);
  //     palette.commandItems = commandItems;
  //   }
  //   function reject(error: any): void {
  //     palette.commandItems = [];
  //   }
  //   matcher.search(search.query, commandItems).then(resolve, reject);
  // });
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
  registry.add(registryItems);
  let header = createHeader();
  let palette = createPalette();
  let dock = createDock();
  let status = createStatus();
  let panel = createPanel(header, palette, dock, status);
  Widget.attach(panel, document.body);
  window.onresize = () => panel.update();
}

window.addEventListener('load', main);
