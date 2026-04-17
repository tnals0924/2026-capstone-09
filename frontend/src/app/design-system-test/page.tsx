'use client';

import { Button, Menu, MenuContent, MenuList, MenuTrigger } from '@wanteddev/wds';
import { IconAgent, IconAiReview, IconPlus } from '@wanteddev/wds-icon';
import { CustomMenu } from '@/components/commons/custom-menu/CustomMemu';

const Demo = () => {
  return (
    <>
      <Menu>
        <MenuTrigger>
          <Button>Click me</Button>
        </MenuTrigger>

        <MenuContent sx={{ width: '154px' }}>
          <MenuList>
            <CustomMenu value="item1" icon={<IconPlus />} onClick={() => console.log('test')}>
              Item 1
            </CustomMenu>
            <CustomMenu value="item2" icon={<IconAiReview />}>
              Item 2
            </CustomMenu>
            <CustomMenu value="item3" icon={<IconAgent />}>
              Item 3
            </CustomMenu>
          </MenuList>
        </MenuContent>
      </Menu>
    </>
  );
};

export default Demo;
