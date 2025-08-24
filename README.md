# Sistema de Gamificação para Vendas de Açougue e Cortes Finos

Sistema desenvolvido para aumentar o engajamento e a produtividade dos vendedores através de elementos de gamificação como pontos, níveis, desafios e ranking.

## Funcionalidades Implementadas

- **Sistema de Login**: Autenticação de usuários com diferentes perfis (vendedor, gerente, admin)
- **Dashboard do Vendedor**: Visualização de pontos, nível, desafios ativos e conquistas
- **Cadastro de Desafios**: Interface para administradores criarem e gerenciarem desafios
- **Sistema de Ranking**: Classificação de vendedores e lojas com filtros por período e tipo
- **Sistema de Notificações**: Alertas sobre novos desafios, conquistas e atualizações

## Estrutura do Projeto

```
├── css/               # Arquivos de estilo
├── img/               # Imagens e recursos visuais
├── js/                # Scripts JavaScript
├── pages/             # Páginas HTML adicionais
└── index.html         # Página inicial (login)
```

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Bootstrap 5
- Feather Icons

## Como Usar

1. Abra o arquivo `index.html` em um navegador
2. Faça login com uma das seguintes credenciais:
   - Vendedor: usuário `vendedor`, senha `123456`
   - Gerente: usuário `gerente`, senha `123456`
   - Admin: usuário `admin`, senha `123456`
3. Navegue pelo sistema utilizando o menu superior

## Funcionalidades por Perfil

### Vendedor
- Visualizar dashboard com pontuação e nível
- Ver desafios ativos e histórico de conquistas
- Consultar ranking de vendedores

### Gerente
- Todas as funcionalidades do vendedor
- Cadastrar e gerenciar desafios
- Visualizar estatísticas de equipe

### Administrador
- Todas as funcionalidades do gerente
- Configurações avançadas do sistema
- Gerenciamento de usuários

## Próximos Passos

- Implementação de backend real com banco de dados
- Integração com sistema de vendas
- Aplicativo mobile para notificações em tempo real
- Expansão do sistema de recompensas