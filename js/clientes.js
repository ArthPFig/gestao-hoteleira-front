// Script relacionado ao módulo de gerenciamento de clientes

// Array principal armazenado no navegador
if(localStorage.getItem('lista') == null) {
    lista = [];
    localStorage.setItem('lista', JSON.stringify(lista));
} else {
    lista = JSON.parse(localStorage.getItem('lista'));
}

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function() {

    // Chamadas
    listar();

    // Salva cadastro e edição
    document.querySelector('#bt-salvar').addEventListener('click', function() {
        // Adiciona dados dos campos ao array principal
        let id = document.querySelector('#campo-id').value;
        let nomeCompleto = document.querySelector('#campo-nome-completo').value;
        let dataNascimento = document.querySelector('#campo-data-nascimento').value;
        let documento = document.querySelector('#campo-documento').value;
        let pais = document.querySelector('#campo-pais').value;
        let estado = document.querySelector('#campo-estado').value;
        let cidade = document.querySelector('#campo-cidade').value;
        let observacao = document.querySelector('#campo-observacao').value;
        let fidelidade = document.querySelector('#fidelidade').checked;

        if  (nomeCompleto.trim() === "" || dataNascimento.trim() === "" || documento.trim() === "" || pais.trim() === "" || 
        estado.trim() === "" || cidade.trim() === "") {
        alert("Por favor preencha os campos do formulário");
        return false;
        }


        if(id != "") {
            let indice = getIndiceListaPorId(id)
            lista[indice] = {id: id, nomeCompleto: nomeCompleto, dataNascimento: dataNascimento,
            documento: documento, pais: pais, estado: estado, cidade: cidade, observacao: observacao, 
            fidelidade: (fidelidade) ? "Sim" : "Não"};
        } else {
            lista.push({id: getMaiorIdLista()+1, nomeCompleto: nomeCompleto, dataNascimento: dataNascimento,
            documento: documento, pais: pais, estado: estado, cidade: cidade, observacao: observacao, 
            fidelidade: (fidelidade) ? "Sim" : "Não"});
        }

        // Armazena a lista atualizada no navegador
        localStorage.setItem('lista', JSON.stringify(lista));

        // Reseta o formulário e recarrega a tabela de listagem
        this.blur();
        document.querySelector('#bt-cancelar').style.display = 'none';
        document.querySelector('#campo-id').value = "";
        document.querySelector('#campo-nome-completo').value = "";
        document.querySelector('#campo-data-nascimento').value = "";
        document.querySelector('#campo-documento').value = "";
        document.querySelector('#campo-pais').value = "";
        document.querySelector('#campo-estado').value = "";
        document.querySelector('#campo-cidade').value = "";
        document.querySelector('#campo-observacao').value = "";
        document.querySelector('#fidelidade').checked = false;
        carregar("Salvo com sucesso!");
        listar();
    });

    // Cancelamento de edição
    document.querySelector('#bt-cancelar').addEventListener('click', function() {
        document.querySelector('#bt-cancelar').style.display = 'none';
        document.querySelector('#campo-id').value = "";
        document.querySelector('#campo-nome-completo').value = "";
        document.querySelector('#campo-data-nascimento').value = "";
        document.querySelector('#campo-documento').value = "";
        document.querySelector('#campo-pais').value = "";
        document.querySelector('#campo-estado').value = "";
        document.querySelector('#campo-cidade').value = "";
        document.querySelector('#campo-observacao').value = "";
        document.querySelector('#fidelidade').value = "";
    });

});

// Funções

function listar() {
    document.querySelector('table tbody').innerHTML = "";
    document.querySelector('#total-registros').textContent = lista.length;
    lista.forEach(function(objeto) {
        // Cria string html com os dados da lista
        let htmlAcoes = "";
        htmlAcoes += '<button class="bt-tabela bt-editar" title="Editar"><i class="ph ph-pencil"></i></button>';
        htmlAcoes += '<button class="bt-tabela bt-excluir" title="Excluir"><i class="ph ph-trash"></i></button>';
        
        let htmlColunas = "";
        htmlColunas += "<td>"+objeto.id+"</td>";
        htmlColunas += "<td>"+objeto.nomeCompleto+"</td>";
        htmlColunas += "<td>"+dataAtualFormatada(objeto.dataNascimento)+"</td>";
        htmlColunas += "<td>"+objeto.documento+"</td>";
        htmlColunas += "<td>"+objeto.pais+"</td>";
        htmlColunas += "<td>"+objeto.estado+"</td>";
        htmlColunas += "<td>"+objeto.cidade+"</td>";
        htmlColunas += "<td>"+objeto.observacao+"</td>";
        htmlColunas += "<td>"+objeto.fidelidade+"</td>";
        htmlColunas += "<td>"+htmlAcoes+"</td>";    
        
        // Adiciona a linha ao corpo da tabela
        let htmlLinha = '<tr id="linha-'+objeto.id+'">'+htmlColunas+'</tr>';
        document.querySelector('table tbody').innerHTML += htmlLinha;
    });

    eventosListagem();
    carregar();
}

function eventosListagem() {
    // Ação de editar objeto
    document.querySelectorAll('.bt-editar').forEach(function(botao) {
        botao.addEventListener('click', function() {
            // Pega os dados do objeto que será alterado
            let linha = botao.parentNode.parentNode;
            let colunas = linha.getElementsByTagName('td');
            let id = colunas[0].textContent;
            let nomeCompleto = colunas[1].textContent;
            let dataNascimento = colunas[2].textContent;
            let documento = colunas[3].textContent;
            let pais = colunas[4].textContent;
            let estado = colunas[5].textContent;
            let cidade = colunas[6].textContent;
            let observacao = colunas[7].textContent;
            let fidelidade = colunas[8].textContent;
            
            // Popula os campos do formulário
            document.querySelector('#campo-id').value = id;
            document.querySelector('#campo-nome-completo').value = nomeCompleto;
            document.querySelector('#campo-data-nascimento').value = dataNascimento;
            document.querySelector('#campo-documento').value = documento;
            document.querySelector('#campo-pais').value = pais;
            document.querySelector('#campo-estado').value = estado;
            document.querySelector('#campo-cidade').value = cidade;
            document.querySelector('#campo-observacao').value = observacao;
            document.querySelector('#fidelidade').checked = (fidelidade == "Sim") ? true : false;
            // Exibe botão de cancelar edição
            document.querySelector('#bt-cancelar').style.display = 'flex';
        });
    });

    // Ação de excluir objeto
    document.querySelectorAll('.bt-excluir').forEach(function(botao) {
        botao.addEventListener('click', function() {
            if(confirm("Deseja realmente excluir?")) {
                // Remove objeto da lista
                let linha = botao.parentNode.parentNode;
                let id = linha.id.replace('linha-','');
                let indice = getIndiceListaPorId(id);
                lista.splice(indice, 1);

                // Armazena a lista atualizada no navegador
                localStorage.setItem('lista', JSON.stringify(lista));

                // Recarrega a listagem
                listar();
            }
        });
    });
}

function getIndiceListaPorId(id) {
    indiceProcurado = null;
    lista.forEach(function(objeto, indice) {
        if(id == objeto.id) {
            indiceProcurado = indice;
        }
    });
    return indiceProcurado;
}

function getMaiorIdLista() {
    if(lista.length > 0) {
        return parseInt(lista[lista.length-1].id);
    } else {
        return 0;
    }
}

function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}
