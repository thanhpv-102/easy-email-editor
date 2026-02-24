import TableOperationMenu from './tableOperationMenu';
import {
  checkEventInBoundingRect,
  setStyle,
  getCurrentTable,
  getElementsBoundary,
  getTdBoundaryIndex,
  getBoundaryRectAndElement,
} from './util';
import { AdvancedTableBlock } from 'easy-email-core';
import { IOperationData } from './type';

export interface IBorderTool {
  top: HTMLElement;
  bottom: HTMLElement;
  left: HTMLElement;
  right: HTMLElement;
}

class TableColumnTool {
  borderTool = {} as IBorderTool;
  dragging = false;
  showBorderTool = false;
  width = 0; // selected section width,will update by mouse move
  height = 0; // selected section height, will update by mouse move

  selectedLeftTopCell: Element | undefined = undefined;
  selectedBottomRightCell: Element | undefined = undefined;
  startDom: Element | undefined = undefined;
  endDom: Element | undefined = undefined;
  hoveringTable: ParentNode | null = null;
  root: Element | ShadowRoot | undefined = undefined;

  tableMenu?: TableOperationMenu;
  changeTableData?: (e: AdvancedTableBlock['data']['value']['tableSource']) => void;
  tableData: IOperationData[][] = [];

  constructor(borderTool: IBorderTool, root: Element | ShadowRoot) {
    if (!borderTool || !root) {
      return;
    }
    this.borderTool = borderTool;
    this.root = root;

    this.initTool();
  }

  initTool() {
    this.root?.addEventListener('contextmenu', this.handleContextmenu);
    this.root?.addEventListener('mousedown', this.handleMousedown.bind(this));
    document.body.addEventListener('click', this.handleBodyClick, false);
    document.addEventListener('contextmenu', this.handleDocumentContextmenu, false);
    document.addEventListener('keydown', this.hideBorderByKeyDown);
  }

  destroy() {
    this.root?.removeEventListener('mousedown', this.handleMousedown.bind(this));
    this.root?.removeEventListener('contextmenu', this.handleContextmenu);
    document.body.removeEventListener('click', this.handleBodyClick, false);
    document.removeEventListener('contextmenu', this.handleDocumentContextmenu, false);
    document.removeEventListener('keydown', this.hideBorderByKeyDown);

    this.tableMenu?.destroy();
  }

  hideBorder = (e: Event) => {
    if ((e.target as HTMLElement)?.id === 'VisualEditorEditMode') {
      return;
    }
    this.visibleBorder(false);
  };

  // Only hide the selection border on left-clicks; right-clicks should not
  // dismiss the selection (they open the context menu instead).
  handleBodyClick = (e: MouseEvent) => {
    if (e.button !== 0) return;
    this.hideBorder(e);
  };

  hideBorderByKeyDown = () => {
    this.visibleBorder(false);
  };

  hideTableMenu = (e?: Event) => {
    if ((e?.target as HTMLElement)?.id === 'VisualEditorEditMode') {
      return;
    }
    this.tableMenu?.hide();
  };

  handleDocumentContextmenu = (e: Event) => {
    // Hide the table menu only when right-clicking outside the editor shadow root.
    // Clicks inside the shadow root are handled by handleContextmenu on this.root,
    // which calls stopImmediatePropagation so this handler won't fire for those.
    const path = e.composedPath ? e.composedPath() : [];
    const insideRoot = path.some(el => el === this.root);
    if (!insideRoot) {
      this.tableMenu?.hide();
    }
  };

  visibleBorder = (show = true) => {
    if (this.showBorderTool === show) {
      return;
    }
    if (show) {
      setStyle(this.borderTool.top.parentElement, { display: 'block' });
    } else {
      setStyle(this.borderTool.top.parentElement, { display: 'none' });
    }
    this.showBorderTool = show;
  };

  renderBorder = () => {
    this.visibleBorder(true);
    const result = getBoundaryRectAndElement(
      this.startDom as Element,
      this.endDom as Element,
    );
    if (!result) {
      return;
    }
    const { left, top, width, height } = result.boundary;
    this.selectedLeftTopCell = result.leftTopCell;
    this.selectedBottomRightCell = result.bottomRightCell;

    setStyle(this.borderTool.top, {
      'background-color': 'rgb(65, 68, 77)',
      left: `${left}px`,
      top: `${top}px`,
      width: `${Math.abs(width)}px`,
      height: '2px',
      position: 'fixed',
      'z-index': 10,
    });
    setStyle(this.borderTool.bottom, {
      'background-color': 'rgb(65, 68, 77)',
      left: `${left}px`,
      top: `${top + height}px`,
      width: `${Math.abs(width)}px`,
      height: '2px',
      position: 'fixed',
      'z-index': 10,
    });
    setStyle(this.borderTool.left, {
      'background-color': 'rgb(65, 68, 77)',
      left: `${left}px`,
      top: `${top}px`,
      width: '2px',
      height: `${Math.abs(height)}px`,
      position: 'fixed',
      'z-index': 10,
    });
    setStyle(this.borderTool.right, {
      'background-color': 'rgb(65, 68, 77)',
      left: `${left + width}px`,
      top: `${top}px`,
      width: '2px',
      height: `${Math.abs(height)}px`,
      position: 'fixed',
      'z-index': 10,
    });
  };

  handleContextmenu = (event: Event) => {
    const mouseEvent = event as MouseEvent;
    if (this.showBorderTool) {
      const selectedBoundary = getElementsBoundary(
        this.selectedLeftTopCell as Element,
        this.selectedBottomRightCell as Element,
      );
      if (checkEventInBoundingRect(selectedBoundary, { x: mouseEvent.clientX, y: mouseEvent.clientY })) {
        event.preventDefault();
        event.stopImmediatePropagation();

        // Show the table operation menu here (contextmenu is the correct event).
        if (!this.tableMenu) {
          this.tableMenu = new TableOperationMenu();
        }
        this.tableMenu.setTableData(this.tableData);
        this.tableMenu.changeTableData = this.changeTableData;
        this.tableMenu.setTableIndexBoundary(
          getTdBoundaryIndex(
            this.selectedLeftTopCell as Element,
            this.selectedBottomRightCell as Element,
          ),
        );
        this.tableMenu.showMenu({ x: mouseEvent.clientX, y: mouseEvent.clientY });
        return;
      }
    }
    this.hideTableMenu();
  };

  handleMousedown(event: Event) {
    const mouseEvent = event as MouseEvent;
    let target: Element = event.target as Element;
    if (mouseEvent.button == 0) {
      // left button click
      while (target && target.parentNode) {
        if (
          (target.nodeName === 'TD' || target.nodeName === 'TH') &&
          target.getAttribute('data-content_editable-type') === 'rich_text'
        ) {
          this.root?.addEventListener('mousemove', this.handleDrag);
          this.root?.addEventListener('mouseup', this.handleMouseup);

          this.dragging = true;
          this.startDom = target;
          this.endDom = target;
          this.hoveringTable = getCurrentTable(target);

          this.renderBorder();
          return;
        }
        target = target.parentNode as Element;
        if (['TR', 'TABLE', 'BODY'].includes(target.nodeName)) {
          this.visibleBorder(false);
          return;
        }
      }
    } else if (mouseEvent.button == 2) {
      if (this.showBorderTool) {
        const selectedBoundary = getElementsBoundary(
          this.selectedLeftTopCell as Element,
          this.selectedBottomRightCell as Element,
        );
        // If right-clicking inside the selection, keep the border visible.
        // The context menu will be shown in handleContextmenu.
        if (checkEventInBoundingRect(selectedBoundary, { x: mouseEvent.clientX, y: mouseEvent.clientY })) {

          return;
        }
      }
    }
    this.visibleBorder(false);
  }

  handleDrag = (e: Event) => {
    e.preventDefault();

    if (this.dragging) {
      let target = e.target as Element;

      while (target && target.parentNode) {
        if (
          (target.nodeName === 'TD' || target.nodeName === 'TH') &&
          target.getAttribute('data-content_editable-type') === 'rich_text'
        ) {
          const hoveringTable = getCurrentTable(target);
          if (this.endDom === target || this.hoveringTable !== hoveringTable) {
            return;
          }
          this.endDom = target;
          this.renderBorder();
          return;
        }
        target = target.parentNode as Element;
      }
    }
  };

  handleMouseup = (e: Event) => {
    e.preventDefault();

    if (this.dragging) {
      this.dragging = false;
      this.root?.removeEventListener('mousemove', this.handleDrag);
      this.root?.removeEventListener('mouseup', this.handleMouseup);
    }
  };
}

export default TableColumnTool;
