import React from "react";
import styles from "./task-list-header.module.css";

interface GanttHeaderItem {
  className?: string;
  style?: React.CSSProperties;
  content?: string
}

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth }) => {

  const rowNameWidth = `${parseInt(rowWidth, 10) + 84}px`

  const HeaderSeparator = () => (
    <div
      className={styles.ganttTable_HeaderSeparator}
      style={{
        height: headerHeight * 0.5,
        marginTop: headerHeight * 0.2,
      }}
    />
  )

  const ganttHeaderItems: GanttHeaderItem[] = [
    {
      content: '#',
      className: styles.ganttTable_HeaderItem,
      style: {
        minWidth: 50,
        maxWidth: 50,
      },
    },
    {
      content: 'Name',
      className: styles.ganttTable_HeaderItem,
      style: {
        minWidth: rowNameWidth,
      },
    },
    {
      content: 'Duration',
      className: styles.ganttTable_HeaderItem,
      style: {
        minWidth: rowWidth,
      },
    },
    {
      content: 'Start',
      className: styles.ganttTable_HeaderItem,
      style: {
        minWidth: rowWidth,
      },
    },
    {
      content: 'Finish',
      className: styles.ganttTable_HeaderItem,
      style: {
        minWidth: rowWidth,
      },
    },
    {
      content: 'Predecessor',
      className: styles.ganttTable_HeaderItem,
      style: {
        minWidth: `${parseInt(rowWidth, 10) + 10}px`,
        maxWidth: `${parseInt(rowWidth, 10) + 10}px`,
      },
    },
    {
      content: '',
      className: styles.ganttTable_HeaderItem,
      style: {
        minWidth: '60px',
      },
    },
  ]

  const renderHeaderItems = ganttHeaderItems.map((item: GanttHeaderItem, i: number) => [
    <div key={`task-list-header-${i}`} className={item.className} style={item.style}>
      {item.content}
    </div>,
    i < ganttHeaderItems.length - 1 
      ? <HeaderSeparator key={`task-list-header-separator-${i}`} />
      : null,
  ])

  return (
    <div id="rgc-xh" className={styles.ganttTable} style={{
      fontFamily: fontFamily,
      fontSize: fontSize,
    }} >
      <div className={styles.ganttTable_Header} style={{
        height: headerHeight - 2,
      }} >

        {renderHeaderItems}

      </div>
    </div>
  );
};
