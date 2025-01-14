import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../search';
import Transfer from '../index';

describe('Transfer.Search', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  const dataSource = [
    {
      key: 'a',
      title: 'a',
      description: 'a',
    },
    {
      key: 'b',
      title: 'b',
      description: 'b',
    },
    {
      key: 'c',
      title: 'c',
      description: 'c',
    },
  ];

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('should show cross icon when input value exists', () => {
    const wrapper = mount(<Search value="" />);
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.setProps({ value: 'a' });
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('onSearch', () => {
    jest.useFakeTimers();

    const onSearch = jest.fn();
    const wrapper = mount(
      <Transfer
        dataSource={dataSource}
        selectedKeys={[]}
        targetKeys={[]}
        render={item => item.title}
        onSearch={onSearch}
        showSearch
      />,
    );
    wrapper
      .find('.ant-input')
      .at(0)
      .simulate('change', { target: { value: 'a' } });
    expect(onSearch).toHaveBeenCalledWith('left', 'a');
    onSearch.mockReset();
    wrapper.find('.ant-input-clear-icon').at(0).simulate('click');
    expect(onSearch).toHaveBeenCalledWith('left', '');
    jest.useRealTimers();
  });

  it('legacy props#onSearchChange doesnot work anymore', () => {
    const onSearchChange = jest.fn();
    const { container } = render(
      <Transfer render={item => item.title} onSearchChange={onSearchChange} showSearch />,
    );

    fireEvent.change(container.querySelector('.ant-input'), {
      target: { value: 'a' },
    });
    expect(errorSpy).not.toHaveBeenCalled();
    expect(onSearchChange).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/26208
  it('typing space should trigger filterOption', () => {
    const filterOption = jest.fn();
    const wrapper = mount(
      <Transfer filterOption={filterOption} dataSource={dataSource} showSearch />,
    );
    wrapper
      .find('.ant-input')
      .at(0)
      .simulate('change', { target: { value: ' ' } });
    expect(filterOption).toHaveBeenCalledTimes(dataSource.length);
  });
});
