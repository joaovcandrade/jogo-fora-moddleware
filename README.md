# Instruções do projeto
Jogo da forca para implementação de modalidades de middlewares

## Instruções de execução cliente 
Para toda as versões existem um executável cliente anexado nas tags (electron), porém testada somente na versão windows (.exe).
Para abrir o executável no windows, siga os seguintes passos:

1 -  Baixe a versão correspondete nas tags e extraia o arquivo.

2 - Na raíz do arquivo extraído execute forca.exe


## Instruções de execução servidor 

### V1.0
Não necessita de servidor, o executável contém o jogo completo.

### V2.0, V3.0 e V4.0
Necessita de um servidor em execução.
O servidor têm como pré requisito a instalação do node.js 14.17.1 LTS e yarn.
O servidor estará disponível em endereço local na porta 3000.

Para iniciar o servidor, siga os seguintes passos:

1 - Clone este projeto e vá até a branch correspondente a versão em que deseja testar (v2,v3 ou v4)

2 - No diretório raiz do projeto navegue até /server
```
cd server
```

3 - instale as dependências yarn install
```
yarn install
```

4 - Execute o servidor com 
```
yarn start
```

# Tech stack

## V1.0
- React.js
- Node.js
- Electron
- Yarn

## V2.0
- React.js
- Node.js
- Electron
- Yarn
- Websocket

## V3.0
- React.js
- Node.js
- Electron
- Yarn
- js-RPC (jayson)

## V4.0
- React.js
- Node.js
- Electron
- Yarn
- RabbitMQ - Stomp

