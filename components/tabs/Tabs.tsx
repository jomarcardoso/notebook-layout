'use client';
import type { FC, HTMLProps, ReactNode } from 'react';
import { useId } from 'react';
import { generateClasses } from '../../utils/utils';
import './tabs.scss';

export interface TabItem {
  label: ReactNode;
  value?: string;
  id?: string;
  disabled?: boolean;
}

export interface TabsProps extends Omit<
  HTMLProps<HTMLUListElement>,
  'onChange'
> {
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
    [className]: Boolean(className),
  });

  return (
    <nav className={classes}>
      <ul className="nav nav-pills" {...props}>
        {tabs.map((tab, index) => {
          const tabValue = tab.value ?? `${index}`;
          const inputId = tab.id || `${groupName}-${index}`;
          const isControlled = typeof value === 'string';

          const checked = isControlled ? value === tabValue : undefined;
          const defaultChecked = !isControlled
            ? typeof defaultValue === 'string'
              ? defaultValue === tabValue
              : index === firstEnabledIndex
            : undefined;

          return (
            <li
              className={`nav-link${checked ? ' active' : ''}`}
              key={tabValue}
            >
              <input
                className="tabs__input"
                type="radio"
                id={inputId}
                name={groupName}
                value={tabValue}
                checked={checked}
                aria-current={checked ? 'true' : 'false'}
                defaultChecked={defaultChecked}
                disabled={tab.disabled}
                onChange={() => onChange?.(tabValue)}
              />

              <label htmlFor={inputId}>{tab.label}</label>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Tabs;
