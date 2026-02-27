'use client';
import type { FC, HTMLProps, ReactNode } from 'react';
import { Fragment, useId } from 'react';
import { generateClasses } from '../../utils/utils';
import './tabs.scss';

export interface TabItem {
  label: ReactNode;
  value?: string;
  id?: string;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLProps<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[];
  name?: string;
  value?: string;
  defaultValue?: string;
  full?: boolean;
  onChange?: (value: string) => void;
}

export const Tabs: FC<TabsProps> = ({
  tabs = [],
  name = '',
  value,
  defaultValue,
  full,
  className = '',
  onChange,
  ...props
}) => {
  const generatedId = useId().replace(/:/g, '');
  const groupName = name || `tabs-${generatedId}`;
  const firstEnabledIndex = tabs.findIndex((tab) => !tab.disabled);

  const classes = generateClasses({
    tabs: true,
    '-full': full,
    [className]: Boolean(className),
  });

  return (
    <div className={classes} {...props}>
      <div className="tabs__items">
        {tabs.map((tab, index) => {
          const tabValue = tab.value ?? `${index}`;
          const inputId = tab.id || `${groupName}-${index}`;
          const isControlled = typeof value === 'string';

          const checked = isControlled ? value === tabValue : undefined;
          const defaultChecked =
            !isControlled
              ? typeof defaultValue === 'string'
                ? defaultValue === tabValue
                : index === firstEnabledIndex
              : undefined;

          return (
            <Fragment key={tabValue}>
              <input
                className="tabs__input"
                type="radio"
                id={inputId}
                name={groupName}
                value={tabValue}
                checked={checked}
                defaultChecked={defaultChecked}
                disabled={tab.disabled}
                onChange={() => onChange?.(tabValue)}
              />

              <label className="tabs__tab" htmlFor={inputId}>
                {tab.label}
              </label>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
