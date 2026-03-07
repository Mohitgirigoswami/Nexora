import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  DashboardIcon, 
  ComponentsIcon, 
  SettingsIcon, 
  SidebarToggleIcon,
  SparklesIcon,
  TaskIcon
} from './Icons';

const sidebarTheme = {
  bg: '#030712', // Ultra Dark (Gray 950)
  hover: '#111827', // Deep Slate
  active: '#06b6d4', // Cyan
  text: '#64748b', // Muted Slate
  activeText: '#f8fafc', // Ghost White
};

const menuItemStyles = {
  button: ({ active }) => ({
    borderRadius: '12px',
    margin: '4px 12px',
    height: '48px',
    color: active ? sidebarTheme.activeText : sidebarTheme.text,
    backgroundColor: active ? sidebarTheme.hover : 'transparent',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: sidebarTheme.hover,
      color: sidebarTheme.activeText,
    },
  }),
  icon: ({ active }) => ({
    color: active ? sidebarTheme.active : sidebarTheme.text,
    marginRight: '12px',
  }),
  label: ({ active }) => ({
    fontWeight: active ? '600' : '400',
  }),
};

const SidebarComponent = ({ collapsed, setCollapsed , me }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Sidebar 
      collapsed={collapsed}
      transitionDuration={400}
      backgroundColor={sidebarTheme.bg}
      rootStyles={{
        borderRight: '1px solid #1e293b',
        [`.${sidebarClasses.container}`]: {
          backgroundColor: sidebarTheme.bg,
          display: 'flex',
          flexDirection: 'column',
        }
      }}
      className="h-full shadow-2xl z-20"
    >
      <div className="flex items-center justify-between p-6 h-20 bg-[#030712]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black bg-linear-to-r from-cyan-400 to-white bg-clip-text text-transparent tracking-tighter">
              NEXORA
            </span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl hover:bg-slate-800 transition-all duration-200 text-slate-500 hover:text-cyan-400"
        >
          <SidebarToggleIcon />
        </button>
      </div>

      <div className="flex-1 mt-4 overflow-y-auto no-scrollbar">
        <Menu menuItemStyles={menuItemStyles}>
          <MenuItem 
            icon={<HomeIcon />} 
            active={location.pathname === '/'}
            component={<Link to="/" />}
          > 
            Home 
          </MenuItem>
          <MenuItem 
            icon={<TaskIcon />} 
            active={location.pathname === '/tasks'}
            component={<Link to="/tasks" />}
          > 
            Roadmap 
          </MenuItem>
        </Menu>
      </div>

      <div className="p-4 border-t border-slate-800/50 bg-[#030712]">
        <div 
          onClick={handleLogout}
          className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 ${!collapsed ? 'hover:bg-rose-500/10 cursor-pointer group' : 'cursor-pointer hover:bg-rose-500/10'}`}
          title="Logout"
        >
          <div className="relative">
            <div className="w-9 h-9 min-w-9 rounded-full bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-black text-white ring-2 ring-slate-900 shadow-xl group-hover:scale-110 transition-transform">
              {((me?.first_name?.[0] || 'M') + (me?.last_name?.[0] || 'G')).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#030712]"></div>
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{(me?.first_name || 'User') + " " + (me?.last_name || '')}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate group-hover:text-rose-400 transition-colors">Logout</span>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;