import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

interface GanttListItem {
  className?: string;
  style?: React.CSSProperties;
  content?: React.ReactNode | string
}

const localeDateStringCache = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }
    return lds;
  };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  onClick: (task: Task) => void | undefined;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  onClick,
}) => {
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  const handleOnClick = (task: Task) => {
    if (onClick) onClick(task);
  };

  const rowNameWidth = `${parseInt(rowWidth, 10) + 84}px`;

  function calculateIndentation(indent: number = 0) {
    return `${indent*8}px`;
  }

  function renderTextBasedOnType(type: string, text: any) {

    return type === "project" ? (
      <b>{text}</b>
    ) : text;

  }

  function calculateDurationString(duration: number | undefined) {
    if (duration !== undefined) {
      if (duration === 0) {
        return "0 days";
      } else if (duration === 1) {
        return "1 day";
      } else if (duration > 1) {
        return `${duration} days`;
      } else {
        // Handle non-positive values if needed
        return "";
      }
    } else {
      return "";
    }
  }

  const tasksLength = tasks.length - 1

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((t, index) => {

        const isNotLastTask = index < tasksLength 

        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = " ▼ ";
        } else if (t.hideChildren === true) {
          expanderSymbol = " ▶ ";
        }

        const duration = calculateDurationString(t.duration);
        const start = toLocaleDateString(t.start, dateTimeOptions).replace(
          /\//g,
          "-"
        );
        const end = toLocaleDateString(t.end, dateTimeOptions).replace(
          /\//g,
          "-"
        );

        const calculatedIndentation = calculateIndentation(t.indent);

        const ganttListItem: GanttListItem[] = [
          {
            content: <div>&nbsp;{t.hierarchicalNumber}&nbsp;</div>,
            className: styles.taskListCell,
            style: {
              minWidth: 50,
              maxWidth: 50,
              borderBottom: isNotLastTask ? '1px solid #ebeff2' : 'none',
            },
          },
          {
            content: (
              <div className={styles.taskListNameWrapper}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    paddingLeft: calculatedIndentation,
                  }}
                >
                  <div onClick={() => onExpanderClick(t)} className={ expanderSymbol ? styles.taskListExpander : styles.taskListEmptyExpander }>
                    {expanderSymbol}
                  </div>

                  <div style={{ display: "block" }} title={t.name} onClick={() => handleOnClick(t)}>
                    {t.displayName}
                  </div>
                </div>
              </div>
            ),
            className: styles.taskListCell,
            style: {
              minWidth: rowNameWidth,
              maxWidth: rowNameWidth,
              cursor: "pointer",
              borderBottom: isNotLastTask ? '1px solid #ebeff2' : 'none',
            },
          },
          {
            content: <div>&nbsp;{t.type == "project" ? <b>{duration}</b> : duration}&nbsp;</div>,
            className: styles.taskListCell,
            style: {
              minWidth: rowWidth,
              maxWidth: rowWidth,
              borderBottom: isNotLastTask ? '1px solid #ebeff2' : 'none',
            },
          },
          {
            content: <div>&nbsp;{renderTextBasedOnType(t.type, start)}&nbsp;</div>,
            className: styles.taskListCell,
            style: {
              minWidth: rowWidth,
              maxWidth: rowWidth,
              borderBottom: isNotLastTask ? '1px solid #ebeff2' : 'none',
            },
          },
          {
            content: <div>&nbsp;{renderTextBasedOnType(t.type, end)}&nbsp;</div>,
            className: styles.taskListCell,
            style: {
              minWidth: rowWidth,
              maxWidth: rowWidth,
              borderBottom: isNotLastTask ? '1px solid #ebeff2' : 'none',
            },
          },
          {
            content: <div>&nbsp;{t.predecessor}</div>,
            className: styles.taskListCell,
            style: {
              minWidth: `${parseInt(rowWidth, 10) + 10}px`,
              maxWidth: `${parseInt(rowWidth, 10) + 10}px`,
              borderBottom: isNotLastTask ? '1px solid #ebeff2' : 'none',
            },
          },
          {
            content: <div>&nbsp;{t.actions}&nbsp;</div>,
            className: styles.taskListCell,
            style: {
              width: '60px',
              borderRight: '1px solid #ebeff2',
              borderBottom: isNotLastTask ? '1px solid #ebeff2' : 'none',
            },
          },
        ]

        // Wrap list items in a div
        const renderListItems = ganttListItem.map((item: GanttListItem, i: number) => (
          <div
              key={`task-list-table-${i}`}
              className={item.className}
              style={item.style}
            >
              {item.content}
          </div>
        ))

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight, borderBottom: "1px solid #e9ecef" }}
            key={`${t.id}row`}
          >
            
            {renderListItems}
            
          </div>
        );
      })}
    </div>
  );

};
