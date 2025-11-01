import { useMemo, type FC, type HTMLProps, type ReactNode } from 'react';
import './footer.scss';
import { generateClasses } from '../../utils/utils';

export interface FooterItemProps extends HTMLProps<HTMLButtonElement> {
  icon?: ReactNode;
}

export interface FooterProps extends HTMLProps<HTMLDivElement> {
  items?: FooterItemProps[];
  footerMenu?: boolean;
  open?: boolean;
}

export const Footer: FC<FooterProps> = ({
  items = [],
  footerMenu,
  open = false,
  children,
  ...props
}) => {
  const classes = generateClasses({
    footer: true,
    'theme-primary': true,
    'footer--menu': Boolean(footerMenu),
    'footer--open': Boolean(open),
  });

  function render() {
    function renderItem({ icon, ...itemProps }: FooterItemProps) {
      const { key: _ignoreKey, ...rest } = itemProps as unknown as Record<
        string,
        unknown
      >;
      return (
        <button
          className="footer__control"
          key={String(icon)}
          {...(rest as any)}
        >
          <span className="svg-icon">{icon}</span>
        </button>
      );
    }

    return (
      <footer className={classes} style={{ zIndex: 1 }} {...props}>
        {children || (
          <div className="footer__navigation">{items.map(renderItem)}</div>
        )}
      </footer>
    );
  }

  const renderMemo = useMemo(render, [children, classes, items, props]);

  return renderMemo;
};

export default Footer;
