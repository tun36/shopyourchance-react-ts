import React,{useState} from 'react';
import {Space, Typography ,Input} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import HeaderMenu from './header-menu.component';
import './header.style.scss';
interface Props {
    onSearch:(value: string) => void;
    loading:boolean;
}
const {Title} = Typography;
const App = (prop:Props) => {
    const [search, setSearch] = useState('');
    return (
        <div className="header-page" >
            <HeaderMenu/>
            <Title style={{marginTop:30}} >ค้นหางานที่ต้องการ ?</Title>
            <Space>
                <Input disabled={prop.loading} onKeyDown={(event)=>event.key==='Enter'?prop.onSearch(search):''} className="search" size="large" placeholder="ค้นหาตำแหน่งที่ต้องการ" suffix={<SearchOutlined disabled={prop.loading} onClick={()=>prop.onSearch(search)}/>} onChange={(e)=> setSearch(e.target.value)}/>
            </Space>
        </div>
    );
};

export default App;