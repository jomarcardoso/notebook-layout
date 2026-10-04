// notebook-layout/components/field/field.markers.spec.tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { FieldMarkers } from './field.markers';

describe('FieldMarkers', () => {
  it('carries each line in its own marker item', () => {
    const container = document.createElement('div');

    container.innerHTML = renderToStaticMarkup(
      <FieldMarkers
        listStyle="disc"
        listStyleImage={['/icons/rice.svg', '']}
        text={'2 xícaras de arroz cozido bem soltinho\n3 ovos'}
      />,
    );

    const items = Array.from(
      container.querySelectorAll('.field-markers__item'),
    );

    expect(items).toHaveLength(2);
    expect(
      items.map(
        (item) => item.querySelector('.field-markers__line')?.textContent,
      ),
    ).toEqual(['2 xícaras de arroz cozido bem soltinho', '3 ovos']);
    expect(items[0].querySelector('.content-figure')).toHaveAttribute(
      'src',
      '/icons/rice.svg',
    );
  });
});
