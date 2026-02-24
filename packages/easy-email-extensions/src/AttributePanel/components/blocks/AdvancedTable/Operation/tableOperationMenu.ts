import { setStyle, getCorrectTableIndexBoundary, getMaxTdCount } from './util';
import styleText from './menu.scss?inline';
import { IBoundingPosition, IOperationData } from './type';
import MENU_CONFIG from './tableMenuConfig';

const MENU_HEIGHT = 305;
const MENU_WIDTH = 200;

export default class TableOperationMenu {
  menuItems = MENU_CONFIG;
  domNode: Element | undefined = undefined;
  styleDom?: HTMLStyleElement;
  visible = false;
  splitCellNode: HTMLElement | undefined = undefined;
  splitCellDivider: HTMLElement | undefined = undefined;

  changeTableData?: (e: IOperationData[][]) => void;
  tableData = undefined as unknown as IOperationData[][];
  tableIndexBoundary = undefined as unknown as IBoundingPosition;
  maxTdCount = 0;

  constructor() {
    this.menuInitial();
    this.mount();
  }

  mount() {
    if (this.domNode) {
      document.body.appendChild(this.domNode);
    }
    document.body.addEventListener('click', this.handleBodyClick.bind(this));
  }

  destroy() {
    this.domNode?.remove();
    if (this.styleDom) {
      document.head.removeChild(this.styleDom);
    }
    document.body.removeEventListener('click', this.handleBodyClick.bind(this));
  }

  handleBodyClick(e: MouseEvent) {
    // Ignore right-clicks — the menu should stay visible after being shown by a right-click
    if (e.button !== 0) return;
    this.hide();
  }

  hide() {
    if (!this.visible) {
      return;
    }
    this.visible = false;
    setStyle(this.domNode, {
      display: 'none',
    });
  }

  addRow(insertIndex: number, colCount: number) {
    const newRow = Array.from({ length: colCount }).map(() => ({ content: '-' }) as any);
    this.tableData.splice(insertIndex, 0, newRow);
    this.changeTableData?.(this.tableData);
  }

  setTableData(tableData: IOperationData[][]) {
    this.tableData = tableData || [];
    this.maxTdCount = getMaxTdCount(this.tableData);
  }

  setTableIndexBoundary(tableIndexBoundary: IBoundingPosition) {
    // get correct boundary index and set table-td boundary
    this.tableIndexBoundary = getCorrectTableIndexBoundary(
      tableIndexBoundary,
      this.tableData,
    );
  }

  showMenu({ x, y }: { x: number; y: number }) {
    this.visible = true;
    this.updateSplitCellVisibility();
    const maxHeight = window.innerHeight;
    const maxWidth = window.innerWidth;
    if (maxWidth - MENU_WIDTH < x) {
      x -= MENU_WIDTH;
    }
    if (maxHeight - MENU_HEIGHT < y) {
      y -= MENU_HEIGHT;
    }
    setStyle(this.domNode, {
      display: 'block',
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      'min-height': '150px',
      width: `${MENU_WIDTH}px`,
      Height: `${MENU_HEIGHT}px`,
    });
  }

  updateSplitCellVisibility() {
    if (!this.splitCellNode || !this.splitCellDivider) return;
    const { top, left, bottom, right } = this.tableIndexBoundary || {};
    // Show splitCell only when exactly one merged cell is selected.
    // A merged cell expands the boundary (right > left or bottom > top),
    // so we check that one cell's span exactly covers the whole boundary.
    let isMerged = false;
    if (this.tableData) {
      const tr = this.tableData[top];
      if (tr) {
        const cell = tr.find(td => td.left === left);
        if (cell) {
          const colSpan = cell.colSpan || 1;
          const rowSpan = cell.rowSpan || 1;
          // The cell is the only one selected if its span exactly matches the boundary
          const cellCoversFullBoundary =
            cell.left === left &&
            cell.right === right &&
            cell.top === top &&
            cell.bottom === bottom;
          isMerged = cellCoversFullBoundary && (colSpan > 1 || rowSpan > 1);
        }
      }
    }
    const display = isMerged ? '' : 'none';
    this.splitCellNode.style.display = display;
    this.splitCellDivider.style.display = display;
  }

  menuInitial() {
    this.styleDom = document.createElement('style');
    this.styleDom.innerText = styleText;
    document.head.appendChild(this.styleDom);

    this.domNode = document.createElement('div');
    this.domNode.classList.add('easy-email-table-operation-menu');
    setStyle(this.domNode, { display: 'none' });

    for (let name in this.menuItems) {
      const itemOption = (this.menuItems as any)[name];
      if (itemOption) {
        const itemNode = itemOption.render
          ? itemOption.render(this)
          : this.menuItemCreator(Object.assign({}, itemOption));
        this.domNode.appendChild(itemNode);

        if (name === 'splitCell') {
          this.splitCellNode = itemNode as HTMLElement;
          const splitDivider = dividingCreator();
          this.splitCellDivider = splitDivider;
          this.domNode.appendChild(splitDivider);
        }

        if (['insertRowDown', 'deleteRow', 'mergeCells'].indexOf(name) > -1) {
          this.domNode.appendChild(dividingCreator());
        }
      }
    }

    // create dividing line
    function dividingCreator() {
      const dividing = document.createElement('div');
      dividing.classList.add('easy-email-table-operation-menu-dividing');
      return dividing;
    }
  }
  menuItemCreator({ text, icon, handler }: any) {
    const node = document.createElement('div');
    node.classList.add('easy-email-table-operation-menu-item');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('easy-email-table-operation-menu-icon');
    iconSpan.innerHTML = icon;

    const textSpan = document.createElement('span');
    textSpan.classList.add('easy-email-table-operation-menu-text');
    textSpan.innerText = text;

    node.appendChild(iconSpan);
    node.appendChild(textSpan);
    node.addEventListener('click', handler.bind(this), false);
    return node;
  }
}
