import React from 'react';
import {Layout, Space, Badge,Row,Col,Button,Dropdown, Typography} from 'antd';
import { isMobile } from 'react-device-detect';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {HiOutlineShoppingBag} from 'react-icons/hi';
import {BiUser} from 'react-icons/bi';
import {Link} from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useSelector } from "react-redux";
import './header.style.scss';
interface Props {
    isBack?:boolean;
}
const items: MenuProps['items'] = [
    {
      key: '1',
      label: (<Link to="/admin/job">จัดการตำแหน่งงาน</Link>),
    },
    {
      key: '2',
      label: (<Link to="/admin/candidate">จัดการผู้สมัคร</Link>),
    }
];
const {Text} = Typography;
const { Header } = Layout;
const App = (props:Props) => {
    const dataRedux = useSelector((state:any) => state.userReducer);
    return (
        <Header className="header-nav" style={{background:'none',textAlign:"right"}}>
            <Row gutter={[0,0]}>
                <Col span={4}>
                    {props.isBack?
                    <Link to="/">
                        <Button type="text" icon={<LeftOutlined />}>
                            Back
                        </Button>
                    </Link>
                    
                    :''}
                </Col>
                <Col span={20} style={{textAlign:"right"}}>
                    <Space size={isMobile?20:30}>
                        <Space><Badge size="small" count={dataRedux.User.carts.length}><Link to="/profile/job/cart"><AiOutlineShoppingCart /> <Text className="_none-mobile">Cart</Text></Link></Badge></Space>
                        <Space><Badge size="small" count={dataRedux.User.applys.length}><Link to="/profile/job/apply"><HiOutlineShoppingBag /> <Text className="_none-mobile">งานที่สมัครแล้ว</Text></Link></Badge></Space>
                        {dataRedux.User.admin?
                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                            <Link to="#"><BiUser /> Admin</Link>
                        </Dropdown>
                        :''}
                    </Space>
                </Col>
            </Row>
        </Header>
    );
};

export default App;