import React from 'react';
import {
  Drawer,
  DrawerProps,
  Form,
  ButtonGroup,
  DateRangePicker,
  Uploader,
  TagGroup,
  Tag,
  IconButton
} from 'rsuite';

import Textarea from '@/components/Textarea';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import { VscSave, VscTrash, VscCopy, VscEllipsis } from 'react-icons/vsc';

import { Icon } from '@rsuite/icons';


const DrawerView = (props: DrawerProps) => {
  const { onClose, ...rest } = props;
  return (
    <Drawer backdrop="static" size="sm" placement="right" onClose={onClose} {...rest}>
      <Drawer.Header>
        <Drawer.Title>Edit Card</Drawer.Title>
        <Drawer.Actions>
          <ButtonGroup>
            <IconButton onClick={onClose} icon={<Icon as={VscSave} />} />
            <IconButton icon={<Icon as={VscCopy} />} />
            <IconButton icon={<Icon as={VscTrash} />} />
            <IconButton icon={<Icon as={VscEllipsis} />} />
          </ButtonGroup>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <Form fluid>


          <Form.Group>
            <Form.ControlLabel>Due date</Form.ControlLabel>
            <Form.Control name="dueDate" accepter={DateRangePicker} />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Prioritize</Form.ControlLabel>
            <TagGroup>
              <Tag color="blue">Low</Tag>
              <Tag color="orange">Medium</Tag>
              <Tag color="red">High</Tag>
            </TagGroup>
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Description</Form.ControlLabel>
            <Form.Control name="description" accepter={Textarea} />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Attachments</Form.ControlLabel>
            <Uploader multiple listType="picture" action="//jsonplaceholder.typicode.com/posts/">
              <button>
                <CameraRetroIcon />
              </button>
            </Uploader>
          </Form.Group>
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default DrawerView;
