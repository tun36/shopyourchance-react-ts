import React from 'react';
import {Form,Button,Select,Collapse,message} from 'antd';
import {BU} from './../../data/bu.data';
import {DATA_JOBFUCTION} from './../../data/jobFuction.data';
import type { CollapseProps } from 'antd';
interface Props {
    onFinish:(e:any)=>void;
}

  
const App = (props:Props) => {
    return (
        <Form
            name="basic"
            layout="inline"
            initialValues={{ remember: true }}
            onFinish={(value)=>{
                if(!value.bu && !value.jobFamily){
                    message.warning('โปรดเลือกบางรายการ');
                    return false;
                }
                props.onFinish(value)
            }}
            autoComplete="off"
            >
                <Form.Item
                name="bu"
                //rules={[{ required: true, message: 'Please input your BU!' }]}
                >
                    <Select
                    style={{width:"200px"}}
                    showSearch
                    placeholder="Select a BU"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={BU}
                />
                </Form.Item>
                <Form.Item
                name="jobFamily"
                //rules={[{ required: true, message: 'Please input your Job Family!' }]}
                >
                    <Select
                    style={{width:"300px"}}
                    showSearch
                    placeholder="Select a Job Family"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={DATA_JOBFUCTION}
                />
                </Form.Item>
                <Form.Item >
                    <Button block type="default" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        
    );
};

export default App;