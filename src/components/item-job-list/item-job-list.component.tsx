import React from 'react';
import {Divider, Space,List, Typography} from 'antd';
import {Link} from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import {BsHandbag} from 'react-icons/bs';
import {JobTyps} from './../../interface/type.interface';

const {Text} = Typography;
const App = (props:JobTyps) => {
    const handleUrl = (category:string,job:string) =>{
        if(category===''){
            return `/job/${job}`;
        }else{
            return `/job/${category}/${job}`;
        }
    }
    return (
        <List.Item 
        actions={[props.onClickEditJob?<Link to="#" onClick={props.onClickEditJob}><RightOutlined /></Link>:<Link to={handleUrl(encodeURIComponent(`${props.category}`),`${props.jobId}`)}><RightOutlined /></Link>]}>
            <List.Item.Meta
            avatar={<BsHandbag />}
            title={props.onClickEditJob?<Link to="#" onClick={props.onClickEditJob}>{props.position}</Link>:<Link to={handleUrl(encodeURIComponent(`${props.category}`),`${props.jobId}`)}>{props.position}</Link>}
            description={
                <Space size={0} direction="vertical">
                    {props.position?<Text type="secondary">{props.title}</Text>:''}
                    <Space size={props.isVertical?0:'middle'} direction={props.isVertical?"vertical":"horizontal"} split={!props.isVertical?<Divider type="vertical" />:''}>
                        {props.statusActive==='N'?<Text type="danger">ปิดรับสมัครชั่วคราว</Text>:''}
                        <Text style={{fontSize:'15px'}} type="secondary">{props.positionNumber} ตำแหน่ง</Text>
                        {props.band?<Text style={{fontSize:'15px'}} type="secondary">Band {props.band}</Text>:''}
                        {props.startDate?<Text style={{fontSize:'15px'}} type="secondary">{props.startDate} - {props.endDate}</Text>:''}
                    </Space>
                </Space>
            }
            />
        </List.Item>
    );
};

export default App;