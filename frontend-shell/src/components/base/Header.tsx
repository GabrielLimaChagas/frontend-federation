import React from "react";
import Row from "../core/Row";
import Button from "../core/Button";
import { useAuth } from "../../services/AuthContext";
import { UserCircleIcon, CheckBadgeIcon } from "@heroicons/react/20/solid";

interface HeaderProps {
  title: string;
  rightAttachment?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, rightAttachment }) => {
  const { isAuthenticated, user, loginDemo, logout } = useAuth();

  return (
    <Row className="bg-white w-full h-14 justify-between items-center px-4 shadow-sm border-b border-neutral-200">
      <Row className="items-center gap-2">
        <span className="text-lg font-bold text-neutral-800">{title}</span>
      </Row>

      <Row className="items-center gap-3">
        {/* Indicador de Sessão e Botão Demo */}
        <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
          {isAuthenticated ? (
            <>
              <CheckBadgeIcon className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-medium text-neutral-700">
                Sessão Ativa: <strong className="text-emerald-700">{user || "admin"}</strong>
              </span>
              <Button
                label="Sair"
                variant="secondary"
                onClick={logout}
              />
            </>
          ) : (
            <>
              <UserCircleIcon className="w-5 h-5 text-neutral-400" />
              <span className="text-xs text-neutral-500">Não autenticado</span>
              <Button
                label="Entrar / Gerar Sessão Demo"
                variant="primary"
                onClick={() => loginDemo("admin")}
              />
            </>
          )}
        </div>

        {rightAttachment}
      </Row>
    </Row>
  );
};

export default Header;
