import React from "react"
import { shallow, configure, mount } from "enzyme"
import { render, fireEvent, screen, getByText, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Table from "../components/activities/tabs/Table"
import EditForm from "../components/activities/tabs/FormActivitie"
import RowFormatter from '../components/activities/tabs/RowFormatter'
import ModalClockify from '../components/activities/tabs/ModalClockify'

import dataSet from './constants/ocupacion.values'
const {
  activitie_1,
  client_1,
  client_2,
  sync,
  clockifyDataSource
} = dataSet
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");

  const Select = (props) => {
    return (
      <select
        value={props.value}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        data-testid={props["data-testid"]}
        className={props.className}
        onChange={(e) =>
          props.onChange( 
            e.target.value
          )
        }
      >
        {props.children}
      </select>
    );
  };

  Select.Option = ({ children, ...otherProps }) => (
    <option {...otherProps}>{children}</option>
  );
  Select.OptGroup = ({ children, ...otherProps }) => (
    <optgroup {...otherProps}>{children}</optgroup>
  );

  return { ...antd, Select };
});
configure({ adapter: new Adapter() })
let props_shallow
let wrapper_shallow
let useEffect
describe("Activities module", () => {
  
  let mockUseEffect = () => {
    useEffect.mockImplementationOnce(f => f())
  }
  
  beforeEach(() => {
    useEffect = jest.spyOn(React, "useEffect")
    props_shallow = {
      portafolio: 0,
      testing: true,
      fillData: jest.fn().mockResolvedValue(sync),
      onEdit: jest.fn().mockResolvedValue(sync)
      //fetchPosts: jest.fn().mockResolvedValue(posts)
    }
    mockUseEffect()
    mockUseEffect()
    wrapper_shallow = shallow(<Table {...props_shallow} />)
  })

  describe("Ocupation:", () => {
    it("Load the Table", () => {
        expect(props_shallow.fillData).toHaveBeenCalled()
    })
    it("Renders the activies", () => {
        // Do anything with form itself
        const Table = wrapper_shallow.find('Table').props()
        expect(Table.dataSource).toHaveLength(2)
        expect(Table.dataSource[0]).toEqual(activitie_1)
      })
    it("Add record", async () => {
      const props = {
        clients: [client_1, client_2], 
        onFinish: jest.fn()
      }
      const wrapper_tl = render(<EditForm {...props}/>);
      const { getByTestId, container } = wrapper_tl;
      const input_1 = getByTestId("act_title");
      const input_2 = getByTestId("act_description");
      fireEvent.change(input_1, { target: { value: 'test' } })
      fireEvent.change(input_2, { target: { value: 'test' } })
      const button = container.querySelector('#submit'); // returns react element
      fireEvent.click(button);
      expect(props.onFinish).toHaveBeenCalled()
      expect(props.onFinish.mock.calls).toEqual([ [ { cli_id: props.clients[0].cli_id, act_title: 'test', act_description: 'test' } ] ])
      
      })
    it("Edit title", async () => {
      const props = {
        data: activitie_1,
        updateActivitie: jest.fn(),
        portafolio: 0
      }
      const wrapper = render(<RowFormatter.RenderTitle {...props}/>);
      const { getByTestId } = wrapper;
      const input = getByTestId(activitie_1.act_id+"--act_title");
      fireEvent.change(input, { target: { value: 'test' } })
      fireEvent.focusOut(input)
      expect(props.updateActivitie).toHaveBeenCalled()
      expect(props.updateActivitie.mock.calls).toEqual([ [ { act_id: activitie_1.act_id, act_title: 'test' } ] ])
      })
    it("Edit description", async () => {
      const props = {
        data: activitie_1,
        updateActivitie: jest.fn(),
        portafolio: 0
      }
      const wrapper = render(<RowFormatter.RenderDescription {...props}/>);
      const { getByTestId } = wrapper;
      const input = getByTestId(activitie_1.act_id+"--act_description");
      fireEvent.change(input, { target: { value: 'test' } })
      fireEvent.focusOut(input)
      expect(props.updateActivitie).toHaveBeenCalled()
      expect(props.updateActivitie.mock.calls).toEqual([ [ { act_id: activitie_1.act_id, act_description: 'test' } ] ])
      })
    it("Edit status", async () => {
      const props = {
        data: activitie_1,
        updateActivitie: jest.fn()
      }
      const wrapper = render(<RowFormatter.RenderStatus {...props}/>);
      const { getByTestId } = wrapper;
      const button = getByTestId(activitie_1.act_id+"--act_status");
      fireEvent.click(button)
      expect(props.updateActivitie).toHaveBeenCalled()
      expect(props.updateActivitie.mock.calls).toEqual([ [ { act_id: activitie_1.act_id, act_status: activitie_1.act_status == 0 ? 1 : 0 } ] ])
      })
    it("Edit client", async () => {
        const props = {
          data: activitie_1,
          updateActivitie: jest.fn(),
          portafolio: 0,
          clientsSelect: [client_1, client_2]
        }
        const wrapper = render(<RowFormatter.RenderClient {...props}/>);
        const { getByTestId, debug } = wrapper;
        const selectMenu = await getByTestId(activitie_1.act_id+"--cli_id"); 
        const options = Array.from(selectMenu.querySelectorAll("option")).map((o) =>
          o.getAttribute("value")
        );
        userEvent.selectOptions(selectMenu, [String(client_1.cli_id)])
        expect(options).toEqual(props.clientsSelect.map(el => String(el.cli_id)));
        expect(props.updateActivitie).toHaveBeenCalled()
        expect(props.updateActivitie.mock.calls).toEqual([ [ { act_id: activitie_1.act_id, cli_id: String(client_1.cli_id)} ] ])
      })
    it("Select task clockify & close modal", async () => {
      let props = {
        setData1: jest.fn(),
        setData2: jest.fn(),
        setData3: jest.fn(), 
        dataSource1: clockifyDataSource.clients,
        dataSource2: [],
        dataSource3: [], 
        visible: true, 
        next: jest.fn(), 
        title: "", 
        disabled1: false,
        disabled2: true,
        disabled3: true, 
        placeholder1: "", 
        placeholder2: "",
        placeholder3: "",
        onCancel: jest.fn(), 
        loading1: false,
        loading2: false,
        loading3: false, 
        btnText: "Registrar"
      }
      const wrapper = render(<ModalClockify {...props}/>);
      const { getByTestId, container } = wrapper;
      const updateProps = props => render(<ModalClockify {...props} />, {container})
      let input;
      //Select 1
      input = await getByTestId("clocki-1"); 
      userEvent.selectOptions(input, [String(clockifyDataSource.clients[0].id)])
      expect(props.setData1).toHaveBeenCalled()
      expect(props.setData1.mock.calls).toEqual([ [ String(clockifyDataSource.clients[0].id) ] ])
      //update props
      props = {...props, dataSource2: clockifyDataSource.projects, disabled2: false}
      updateProps({...props})
      //Select 2
      input = await getByTestId("clocki-2"); 
      userEvent.selectOptions(input, [String(clockifyDataSource.projects[1].id)])
      expect(props.setData2).toHaveBeenCalled()
      expect(props.setData2.mock.calls).toEqual([ [ String(clockifyDataSource.projects[1].id) ] ])
      //update props
      props = {...props, dataSource3: clockifyDataSource.tasks, disabled3: false}
      updateProps({...props})
      //Select 3
      input = await getByTestId("clocki-3"); 
      userEvent.selectOptions(input, [String(clockifyDataSource.tasks[0].id)])
      expect(props.setData3).toHaveBeenCalled()
      expect(props.setData3.mock.calls).toEqual([ [ String(clockifyDataSource.tasks[0].id) ] ])
      //click next
      input = await getByTestId("clocki-next"); 
      userEvent.click(input)
      expect(props.next).toHaveBeenCalled()
      //click cancel/back
      input = await getByTestId("clocki-cancel"); 
      userEvent.click(input)
      expect(props.onCancel).toHaveBeenCalled()
      }) 
  })
})
