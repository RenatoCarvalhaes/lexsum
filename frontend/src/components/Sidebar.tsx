import React from 'react';
import { Home, ScrollText, Shield, Settings, LogOut, Users, UserPlus, Building } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'inicial', label: 'Inicial', icon: Home },
    { id: 'contestacao', label: 'Contestação', icon: ScrollText },
    { id: 'impugnacao', label: 'Impugnação', icon: Shield },
    { 
      id: 'cadastros',
      label: 'Cadastros',
      icon: Users,
      submenu: [
        { id: 'cadastros', label: 'Visualizar Todos', icon: Users },
        { id: 'pessoas-fisicas', label: 'Nova Pessoa Física', icon: UserPlus },
        { id: 'pessoas-juridicas', label: 'Nova Pessoa Jurídica', icon: Building }
      ]
    }
  ];

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    window.location.reload();
  };

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4">
        <h2 className="text-xl font-bold">LexSum</h2>
      </div>
      
      <nav className="mt-8 flex-grow">
        {menuItems.map((item) => {
          const Icon = item.icon;
          if (item.submenu) {
            return (
              <div key={item.id}>
                <div className="flex items-center px-6 py-3 text-sm text-gray-300">
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
                <div className="ml-12">
                  {item.submenu.map((subitem) => (
                    <button
                      key={subitem.id}
                      onClick={() => onPageChange(subitem.id)}
                      className={`w-full flex items-center text-left px-3 py-2 text-sm ${
                        currentPage === subitem.id
                          ? 'text-white bg-gray-900'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {subitem.icon && <subitem.icon className="h-4 w-4 mr-2" />}
                      {subitem.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-sm ${
                currentPage === item.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-gray-700">
        <button
          onClick={() => onPageChange('configuracoes')}
          className={`w-full flex items-center px-6 py-3 text-sm ${
            currentPage === 'configuracoes'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Settings className="h-5 w-5 mr-3" />
          Configurações
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;