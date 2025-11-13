import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Button,
  ComboBox,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  Slider,
  SliderThumb,
  SliderTrack,
  Switch,
  useDragAndDrop,
} from 'react-aria-components';
import { useListData } from '@react-stately/data';

interface FrameworkOption {
  id: string;
  name: string;
  description: string;
  maturity: 'battle-tested' | 'emerging' | 'exploratory';
}

const FRAMEWORK_OPTIONS: FrameworkOption[] = [
  {
    id: 'react-aria',
    name: 'React Aria Components',
    description: 'Headless, accessible primitives maintained by Adobe – style any way you need.',
    maturity: 'battle-tested',
  },
  {
    id: 'shadcn',
    name: 'shadcn/ui',
    description: 'Tailwind + Radix recipes you own – great when you want total control with Tailwind.',
    maturity: 'emerging',
  },
  {
    id: 'intent',
    name: 'Intent UI',
    description: 'Newer component suite opinionated for AI dashboards – slick but early days.',
    maturity: 'exploratory',
  },
];

function classNames(...values: Array<string | null | undefined | false>) {
  return values.filter(Boolean).join(' ');
}

export function UiDemoScreen() {
  const [container, setContainer] = useState<Element | null>(null);
  const [theme, setTheme] = useState<'baseline' | 'neon'>('baseline');
  const [selectedFramework, setSelectedFramework] = useState<string>('react-aria');
  const [glowLevel, setGlowLevel] = useState<number>(62);
  const dragList = useListData({
    initialItems: [
      { id: 'alerts', title: 'Alert banners', hint: 'Summaries pulled from wizard validation' },
      { id: 'tables', title: 'Data tables', hint: 'Campaign + session views with drag sorting' },
      { id: 'dialogs', title: 'Dialogs & toasts', hint: 'React Aria modals themed for ShadowMaster' },
      { id: 'presets', title: 'Preset library chips', hint: 'Drag to reorder suggestion priority' },
    ],
  });

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys]
        .map((key) => dragList.getItem(key))
        .filter(Boolean)
        .map((item) => ({ 'text/plain': item!.title })),
    onReorder: (event) => {
      const keys = [...event.keys];
      if (keys.length === 0) {
        return;
      }

      const targetKey = event.target.key;
      const dropPosition = event.target.dropPosition === 'on' ? 'after' : event.target.dropPosition;

      if (targetKey == null) {
        const movedItems = keys.map((key) => dragList.getItem(key)!).filter(Boolean);
        dragList.removeMany(keys);
        if (dropPosition === 'before') {
          dragList.insert(0, ...movedItems);
        } else {
          dragList.insert(dragList.items.length, ...movedItems);
        }
        return;
      }

      if (dropPosition === 'before') {
        dragList.moveBefore(keys, targetKey);
      } else if (dropPosition === 'after') {
        dragList.moveAfter(keys, targetKey);
      }
    },
  });

  useEffect(() => {
    setContainer(document.getElementById('ui-demo-react-root'));
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(
    <div className={classNames('ui-demo__surface', `ui-demo__surface--${theme}`)}>
      <header className="ui-demo__header">
        <div>
          <h2 className="ui-demo__title">UI playground</h2>
          <p className="ui-demo__subtitle">
            Prototype accessible building blocks with{' '}
            <strong>react-aria-components</strong> before rolling them into ShadowMaster.
          </p>
        </div>
        <Switch
          isSelected={theme === 'neon'}
          onChange={(isSelected) => setTheme(isSelected ? 'neon' : 'baseline')}
          className={({ isSelected, isFocusVisible }) =>
            classNames(
              'ui-demo__switch',
              isSelected && 'ui-demo__switch--selected',
              isFocusVisible && 'ui-demo__switch--focus',
            )
          }
        >
          Neon theme
        </Switch>
      </header>

      <div className="ui-demo__grid">
        <section className="ui-demo__panel" aria-labelledby="ui-demo-combobox-heading">
          <Heading id="ui-demo-combobox-heading" level={3} className="ui-demo__panel-title">
            Compare component libraries
          </Heading>
          <p className="ui-demo__panel-copy">
            The combo box below is wired with React Aria. Try filtering or selecting an option to see
            how the list behaves.
          </p>
          <ComboBox
            className="ui-demo__combobox"
            selectedKey={selectedFramework}
            onSelectionChange={(key) => setSelectedFramework(typeof key === 'string' ? key : '')}
            defaultItems={FRAMEWORK_OPTIONS}
          >
            <Label className="ui-demo__label">Preferred toolkit</Label>
            <Input className="ui-demo__combobox-input" placeholder="Search libraries" />
            <ListBox className="ui-demo__combobox-list">
              {(item) => (
                <ListBoxItem
                  id={item.id}
                  className={({ isFocused, isSelected }) =>
                    classNames(
                      'ui-demo__combobox-item',
                      `ui-demo__combobox-item--${item.maturity}`,
                      isFocused && 'ui-demo__combobox-item--focus',
                      isSelected && 'ui-demo__combobox-item--selected',
                    )
                  }
                >
                  <span className="ui-demo__item-title">{item.name}</span>
                  <span className="ui-demo__item-description">{item.description}</span>
                </ListBoxItem>
              )}
            </ListBox>
          </ComboBox>
          <div className="ui-demo__selection-pill">
            <span className="ui-demo__pill-label">Selected</span>
            <span className="ui-demo__pill-value">
              {FRAMEWORK_OPTIONS.find((option) => option.id === selectedFramework)?.name ?? '—'}
            </span>
          </div>
        </section>

        <section className="ui-demo__panel" aria-labelledby="ui-demo-slider-heading">
          <Heading id="ui-demo-slider-heading" level={3} className="ui-demo__panel-title">
            Ambient glow
          </Heading>
          <p className="ui-demo__panel-copy">
            Controlled slider with live value – useful for tuning intensities in new UI themes.
          </p>
          <Slider
            value={[glowLevel]}
            onChange={(values) => setGlowLevel(values[0] ?? glowLevel)}
            minValue={0}
            maxValue={100}
            className="ui-demo__slider"
          >
            <Label className="ui-demo__label">Neon saturation</Label>
            <SliderTrack className="ui-demo__slider-track">
              <SliderThumb className={({ isFocusVisible }) =>
                classNames('ui-demo__slider-thumb', isFocusVisible && 'ui-demo__slider-thumb--focus')
              }
              />
            </SliderTrack>
          </Slider>
          <div className="ui-demo__slider-output">{glowLevel}% intensity</div>
        </section>

        <section className="ui-demo__panel" aria-labelledby="ui-demo-dnd-heading">
          <Heading id="ui-demo-dnd-heading" level={3} className="ui-demo__panel-title">
            Drag & drop ordering
          </Heading>
          <p className="ui-demo__panel-copy">
            This list uses <code>useDragAndDrop</code> from React Aria. Drag items to reorder the backlog we
            plan to tackle next.
          </p>
          <ListBox
            aria-label="UI backlog"
            selectionMode="none"
            className="ui-demo__dnd-list"
            items={dragList.items}
            dragAndDropHooks={dragAndDropHooks}
          >
            {(item) => (
              <ListBoxItem
                id={item.id}
                textValue={item.title}
                className={({ isFocusVisible, isDragging, isDropTarget }) =>
                  classNames(
                    'ui-demo__dnd-item',
                    isFocusVisible && 'ui-demo__dnd-item--focus',
                    isDragging && 'ui-demo__dnd-item--dragging',
                    isDropTarget && 'ui-demo__dnd-item--target',
                  )
                }
              >
                <span className="ui-demo__dnd-title">{item.title}</span>
                <span className="ui-demo__dnd-hint">{item.hint}</span>
                <span aria-hidden className="ui-demo__dnd-handle">⋮⋮</span>
              </ListBoxItem>
            )}
          </ListBox>
        </section>

        <section className="ui-demo__panel" aria-labelledby="ui-demo-dialog-heading">
          <Heading id="ui-demo-dialog-heading" level={3} className="ui-demo__panel-title">
            Reactive dialog prototype
          </Heading>
          <p className="ui-demo__panel-copy">
            Dialog + overlay primitives with focus trapping, ready to reskin as ShadowMaster modals.
          </p>
          <DialogTrigger>
            <Button className="ui-demo__button">Open palette preview</Button>
            <Modal className="ui-demo__modal">
              <Dialog className="ui-demo__dialog">
                {({ close }) => (
                  <>
                    <Heading slot="title" className="ui-demo__dialog-title">
                      Neon palette
                    </Heading>
                    <div className="ui-demo__swatch-grid">
                      <span className="ui-demo__swatch ui-demo__swatch--magenta" />
                      <span className="ui-demo__swatch ui-demo__swatch--cyan" />
                      <span className="ui-demo__swatch ui-demo__swatch--amber" />
                    </div>
                    <p className="ui-demo__dialog-copy">
                      React Aria handles focus management and escape sequences for us. We just theme the
                      pieces.
                    </p>
                    <Button onPress={close} className="ui-demo__button ui-demo__button--ghost">
                      Close
                    </Button>
                  </>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>
        </section>
      </div>
    </div>,
    container,
  );
}
