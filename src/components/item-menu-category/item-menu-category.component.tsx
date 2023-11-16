import Card from 'antd/es/card/Card';
import React from 'react';
import './../item-menu-category/item-menu-category.style.scss';
import {Space, Typography} from 'antd';
import {CategoryType} from './../../interface/type.interface';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';


const {Title,Paragraph} = Typography; 
const App = (props:CategoryType) => {
    return (
        <Link to={`/category/${encodeURIComponent(props.title)}`}>
            <Card size={props.inline?"small":"default"} className={`item-menu-category ${props.inline?'inline':''}`}>
                <Space size={isMobile?0:'middle'} direction={props.inline?"horizontal":"vertical"}>
                    <img width={isMobile?40:50} src={props.icon} />
                    <Paragraph
                    ellipsis={{
                        rows:2,
                        expandable: false
                    }}
                    >
                        <Title style={{margin:0}} level={5}>{props.title}</Title>
                    </Paragraph>
                    
                </Space>
            </Card>
        </Link>
    );
};

export default App;