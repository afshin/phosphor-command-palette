/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use-strict';

import {
BoxPanel
} from 'phosphor-boxpanel';

import {
Widget
} from 'phosphor-widget';


const DURATION = 1500;

const IDLE_MESSAGE = 'Idle';


let status: Widget = null;

let timeout: number = null;

export
function createStatus(): Widget {
  status = new Widget();
  status.addClass('D-Status');
  status.node.textContent = IDLE_MESSAGE;
  BoxPanel.setSizeBasis(status, 20);
  BoxPanel.setStretch(status, 0);
  return status;
}

export
function updateStatus(text: string, permanent?: boolean): void {
  status.node.textContent = text || IDLE_MESSAGE;
  if (permanent) {
    clearTimeout(timeout);
    return;
  }
  timeout = setTimeout(() => status.node.textContent = IDLE_MESSAGE, DURATION);
}
