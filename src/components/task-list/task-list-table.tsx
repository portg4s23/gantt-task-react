import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

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
    if(onClick) onClick(task)
  }

  const rowNameWidth = `${parseInt(rowWidth, 10) + 84}px`

  function renderTextBasedOnType(type: string, text: any) {
    return type === "project" ? <b>{text}</b> : text;
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

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map((t) => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = " ▼ ";
        } else if (t.hideChildren === true) {
          expanderSymbol = " ▶ ";
        }

        const duration = calculateDurationString(t.duration);
        const start = toLocaleDateString(t.start, dateTimeOptions).replace(/\//g, '-')
        const end = toLocaleDateString(t.end, dateTimeOptions).replace(/\//g, '-')

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div className={styles.taskListCell}
              style={{
                minWidth: 65,
                maxWidth: 65,
              }}
            >
              <div>&nbsp;{t.hierarchicalNumber}</div>
            </div>
            <div className={styles.taskListCell}
              style={{
                minWidth: 16,
                maxWidth: 16,
              }}
            >
              <div
                className={
                  expanderSymbol
                    ? styles.taskListExpander
                    : styles.taskListEmptyExpander
                }
                onClick={() => onExpanderClick(t)}
              >
                {expanderSymbol}
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowNameWidth,
                maxWidth: rowNameWidth,
                cursor: "pointer",
              }}
              title={t.name}
            >
              <div className={styles.taskListNameWrapper}>
                <div style={{ display: 'block' }} onClick={() => handleOnClick(t)}>{renderTextBasedOnType(t.type, t.name)}</div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{t.type == "project" ? <b>{duration}</b> : duration}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{renderTextBasedOnType(t.type, start)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{renderTextBasedOnType(t.type, end)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{t.dependencySelector}
            </div>
          </div>
        );
      })}
    </div>
  );
};
