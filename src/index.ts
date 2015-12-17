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
  CommandPalette, ICommandSection, ICommandSpec
} from './commandpalette';

import './index.css';


const INSTRUCTIONS = 'Check out the command palette';

const commands: ICommandSection[] = [
  {
    header: 'Near eastern civilizations',
    specs: [
      {
        originalText: 'The city-state of Sumer',
        command: { id: 'sumer', caption: 'Show Sumer', shortcut: '⌘⎋' }
      },
      {
        originalText: 'The Babylonian empire',
        command: { id: 'babylon', caption: 'Show Babylon', shortcut: '⌘⎋' }
      },
      {
        originalText: 'The Old Kingdom of Egypt',
        command: { id: 'oldking', caption: 'Show Old Kingdom', shortcut: '⌘⎋' }
      },
      {
        originalText: 'The city-state of Tyre',
        command: { id: 'tyre', caption: 'Show Tyre', shortcut: '⌘⎋' }
      },
      {
        originalText: 'The Hittite empire',
        command: { id: 'hittite', caption: 'Show Hittite empire', shortcut: '⌘⎋' }
      },
      {
        originalText: 'The Hellenistic kingdom of Parthia',
        command: { id: 'parthia', caption: 'Show Parthia', shortcut: '⌘⎋' }
      },
      {
        originalText: 'The Neo-Babylonian empire',
        command: { id: 'neobab', caption: 'Show Neo-Babylonia', shortcut: '⌘⎋' }
      }
    ]
  },
  {
    header: 'Foo, bar, and friends',
    specs: [
      {
        originalText: 'Foo original text',
        command: { id: 'foo', caption: 'Run Foo!' }
      },
      {
        originalText: 'Bar original text',
        command: { id: 'bar', caption: 'Run Bar!' }
      },
      {
        originalText: 'Baz original text',
        command: { id: 'baz', caption: 'Run Baz!' }
      },
      {
        originalText: 'Qux original text',
        command: { id: 'qux', caption: 'Run Qux!' }
      }
    ]
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
  palette.commands = commands;
  palette.execute.connect((sender, args) => {
    console.log('execute signal for command: ', args);
  });
  palette.search.connect((sender, args) => {
    console.log('search signal: ', args);
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
  let header = createHeader();
  let palette = createPalette();
  let dock = createDock();
  let status = createStatus();
  let panel = createPanel(header, palette, dock, status);
  Widget.attach(panel, document.body);
  window.onresize = () => panel.update();
}

window.addEventListener('load', main);
