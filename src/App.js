import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ConfigProvider, Layout, Menu } from 'antd';
import { CloudDownloadOutlined, LineChartOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import enUS from 'antd/locale/en_US';
import ErrorBoundary from './ErrorBoundary';
import { Download, Trends } from './Graph/';

import AdoptLogo from 'url:./Adoptlogo.svg';

const { Header, Content, Sider } = Layout;

export default function App() {
	const [collapsed, setCollapsed] = useState(false);

	const toggle = () => {
		setCollapsed(!collapsed);
	};

	return (
		<ConfigProvider locale={enUS}>
			<Layout>
				<Header className="header" style={{ background: '#152935' }}>
					<div className="logo" />
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={['2']}
						style={{ lineHeight: '64px', background: '#152935' }}
						items={[
							{
								key: '1',
								label: (
									<a href="https://adoptopenjdk.net/" style={{ height: '100%', display: 'flex' }}>
										<img src={AdoptLogo} alt="Adopt Logo" />
									</a>
								)
							},
							{
								key: '2',
								label: <Link to="/download">Download Stats</Link>
							}
						]}
					/>
				</Header>
				<Layout>
					<Sider width={200} style={{ background: '#fff' }} trigger={null} collapsible collapsed={collapsed}>
						<Menu
							mode="inline"
							defaultSelectedKeys={['1']}
							defaultOpenKeys={['sub1']}
							style={{ height: '100%', borderRight: 0, marginTop: 20 }}
							items={[
								{
									key: '1',
									icon: <CloudDownloadOutlined />,
									label: <Link to="/download">Download</Link>
								},
								{
									key: '2',
									icon: <LineChartOutlined />,
									label: <Link to="/trends">Trends</Link>
								}
							]}
						/>
					</Sider>
					<Layout style={{ padding: '0 24px 24px' }}>
						<ErrorBoundary>
							<Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
								{React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
									className: "trigger",
									onClick: toggle
								})}
								<Routes>
									<Route path="/" element={<Download />} />
									<Route path="/download" element={<Download />} />
									<Route path="/trends" element={<Trends />} />
								</Routes>
							</Content>
						</ErrorBoundary>
					</Layout>
				</Layout>
			</Layout>
		</ConfigProvider>
	);
}