'use client';
import type { FC, HTMLProps, ReactNode } from 'react';
import { useId, useState } from 'react';
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
  onChange?: (value: string) => void;
}

export const Tabs: FC<TabsProps> = ({
  tabs = [],
  name = '',
  value,
  defaultValue,
  className = '',
  onChange,
  ...props
}) => {
  const generatedId = useId().replace(/:/g, '');
  const groupName = name || `tabs-${generatedId}`;
  const values = tabs.map((tab, index) => tab.value ?? `${index}`);
  const firstEnabledValue = values[tabs.findIndex((tab) => !tab.disabled)] ?? '';
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? firstEnabledValue,
  );
  const currentValue = typeof value === 'string' ? value : uncontrolledValue;

  function select(nextValue: string) {
    setUncontrolledValue(nextValue);
    onChange?.(nextValue);
  }

  return (
    <nav className={generateClasses({ tabs: true, [className]: !!className })}>
      <ul className="nav nav-tabs" {...props}>
        {tabs.map((tab, index) => {
          const tabValue = values[index];
          const inputId = tab.id || `${groupName}-${index}`;
          const active = currentValue === tabValue;

          return (
            <li className="nav-item" key={tabValue}>
              <label
                htmlFor={inputId}
                className={generateClasses({
                  'nav-link': true,
                  active,
                  disabled: !!tab.disabled,
                })}
              >
                <input
                  className="tabs__input"
                  type="radio"
                  id={inputId}
                  name={groupName}
                  value={tabValue}
                  checked={active}
                  disabled={tab.disabled}
                  onChange={() => select(tabValue)}
                />
                {tab.label}
              </label>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Tabs;
