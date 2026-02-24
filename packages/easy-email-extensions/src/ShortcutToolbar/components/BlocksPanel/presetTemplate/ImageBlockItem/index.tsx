import React from 'react';
import { AdvancedType, IImage, RecursivePartial } from 'easy-email-core';
import { Stack } from 'easy-email-editor';

import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';
import { Picture } from '@extensions/ShortcutToolbar/components/Picture';
import { getImg } from '@extensions/ShortcutToolbar/utils/getImg';

const imageList = [
  {
    attributes: {
      src: getImg('IMAGE_45'),
      padding: '10px 25px 10px 25px',
      'padding-left': '0px',
      'padding-right': '0px',
      'padding-top': '0px',
      'padding-bottom': '0px'
    }
  },
  {
    attributes: {
      src: getImg('IMAGE_44'),
      padding: '10px 25px 10px 25px',
      'padding-left': '25px',
      'padding-right': '25px',
      'padding-top': '0px',
      'padding-bottom': '0px',
      'border-radius': '15px'
    },
  },
  {
    attributes: {
      src: getImg('IMAGE_43'),
      padding: '10px 25px 10px 25px',
      'padding-left': '25px',
      'padding-right': '25px',
      'padding-top': '0px',
      'padding-bottom': '0px',
      'border-radius': '999px',
      width: '200px',
      height: '200px'
    },
  }
];

export function ImageBlockItem() {
  return (
    <Stack.Item fill>
      <Stack vertical>
        {imageList.map((item, index) => {
          return (
            <BlockMaskWrapper
              key={index}
              type={AdvancedType.IMAGE}
              payload={
                {
                  attributes: item.attributes,
                } as RecursivePartial<IImage>
              }
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Picture
                  src={item.attributes.src}
                  style={{
                    width: item.attributes.width,
                    height: item.attributes.height,
                    borderRadius: item.attributes['border-radius']
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                  }}
                />
              </div>
            </BlockMaskWrapper>
          );
        })}
      </Stack>
    </Stack.Item>
  );
}
