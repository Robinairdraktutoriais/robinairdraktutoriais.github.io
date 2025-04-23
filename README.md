<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>By RevisionSMM</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/5.0.0/css/bootstrap.min.css">
    <style>
        body {
            background-color: #CDCDCD;
            color: #310075;
            font: 1.125rem Arial, sans-serif;
        }

        .container {
            background-color: rgba(0, 0, 255, 0);
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 1rem;
            text-align: center;
        }

        .custom-card {
            background-color: #f8f9fa;
            border: 1px solid #ced4da;
            border-radius: 0.625rem;
            padding: 1.5rem;
        }

        .custom-card .card-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 1rem;
        }

        .custom-card p {
            font-size: 1rem;
            text-align: left;
        }

        h1 {
            font-size: 2rem;
            color: #2c3e50;
        }

        pre {
            background-color: #f5f5f5;
            padding: 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
        }

        strong {
            font-weight: bold;
        }

        /* Ajustes para dispositivos menores */
        @media (max-width: 768px) {
            .card {
                margin-bottom: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Configurações do Painel | By RevisionSMM</h1>

        <div class="row">
            <div class="col-md-6">
                <div class="card custom-card mb-4" aria-label="Upload do Arquivo">
                    <div class="card-body">
                        <h5 class="card-title">1. Faça o Upload do Arquivo para o Seu Diretório:</h5>
                        <p class="card-text">Comece fazendo o upload do arquivo para o diretório do seu servidor onde deseja realizar a instalação ou ação. Certifique-se de que o arquivo esteja no local correto antes de prosseguir.</p>
                    </div>
                </div>
                <div class="card custom-card mb-4" aria-label="Extração de arquivo ZIP">
                    <div class="card-body">
                        <h5 class="card-title">2. Extraia o Arquivo ZIP no Seu Diretório:</h5>
                        <p class="card-text">Caso o arquivo que você enviou seja um arquivo ZIP, descompacte-o no mesmo diretório onde você fez o upload. Isso garantirá que todos os arquivos necessários estejam prontos para uso.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card custom-card mb-4" aria-label="Criação de Banco de Dados">
                    <div class="card-body">
                        <h5 class="card-title">3. Crie um Banco de Dados e Faça o Upload do database.sql:</h5>
                        <p class="card-text">No seu servidor, crie um banco de dados para a aplicação ou serviço que você está configurando. Em seguida, faça o upload do arquivo <code>database.sql</code> para esse banco de dados. Isso é importante para garantir que a aplicação tenha acesso aos dados necessários.</p>
                    </div>
                </div>
                <div class="card custom-card mb-4" aria-label="Seleção de versão PHP">
                    <div class="card-body">
                        <h5 class="card-title">4. Selecione a Versão do PHP 7.4:</h5>
                        <p class="card-text">Certifique-se de que a versão do PHP no seu servidor está configurada para a versão 7.4 e também marque: (ioncube_loader) em Extensões PHP. Isso é fundamental para garantir que a aplicação funcione corretamente, pois diferentes versões do PHP podem ter comportamentos distintos..</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card custom-card mb-4" aria-label="Configuração do arquivo config.php">
                    <div class="card-body">
                        <h5 class="card-title">5. Configure as Credenciais do Banco de Dados no arquivo <code>config.php</code>:</h5>
                        <p class="card-text">Acesse o arquivo <code>config.php</code> localizado em seu diretório de instalação ("int/config.php" e "int/conexao.php"). Dentro desses arquivos, você precisará configurar as informações de acesso ao banco de dados, utilizando a mesma senha e usuário criados para o banco de dados.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card custom-card" aria-label="Configuração de Cron Jobs">
                    <div class="card-body">
                        <h5 class="card-title">6. Configure as Cron Jobs:</h5>
                        <p class="card-text"><strong>Para cPanel:</strong> Configure uma cron job para ser executada a cada minuto. Use o seguinte comando no cPanel:</p>
                        <pre>
                            curl --silent https://seudominio.com/crons.php >/dev/null 2>&1
                        </pre>
                        <p class="card-text"><strong>Para Hostinger:</strong> Configure uma cron job para ser executada a cada minuto no Hostinger. Use o seguinte comando:</p>
                        <pre>
                            curl -v 'https://seudominio.com/crons.php'
                        </pre>
                        <p class="card-text">Substitua <code>https://seudominio.com</code> pelo URL correto do seu site ou aplicação. Além disso, verifique se todas as etapas anteriores foram concluídas com sucesso antes de configurar as cron jobs.</p>
                    </div>
                </div>
            </div>
        </div>

        <p class="mt-4"><strong>Para funcionar corretamente a atualização de preço, vá até o banco de dados > tabela <code>currency</code> e altere as opções de <code>USD</code> para <strong>2</strong> e de <code>BRL</code> para <strong>1</strong> na coluna <strong>default</strong>. Atualize as taxas de câmbio se necessário.</strong></p>
    </div>

    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/5.0.0/js/bootstrap.min.js"></script>
</body>
</html>
</body>
</html>
