import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import classes from './LanguagePicker.module.css';
import uzbekFlag from '../../assets/images/uzbekistan-flag.png';
import russianFlag from '../../assets/images/russian-flag.svg';
import britainFlag from '../../assets/images/britain-flag.svg';
import { useTranslation } from 'react-i18next';

const data = [
  { label: "O'zbek", image: uzbekFlag, code: 'uz' },
  { label: 'Русский', image: russianFlag, code: 'ru' },
  { label: 'English', image: britainFlag, code: 'en' },
];

export function LanguageSelect() {
  const { i18n } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(data.find((d) => d.code === i18n.language) || data[0]);

  const handleSelect = (item) => {
    setSelected(item);
    i18n.changeLanguage(item.code);
    setOpened(false);
  };

  const items = data?.map((item) => (
    <Menu.Item
      key={item.label}
      leftSection={<Image src={item.image} style={{ objectFit: 'cover' }} width={18} height={18} />}
      onClick={() => handleSelect(item)}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <Image src={selected.image} w={22} h={22} style={{ objectFit: 'cover' }} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}

export default LanguageSelect;
