document.addEventListener('DOMContentLoaded', () => {

    const clienteForm = document.getElementById('clienteForm');
    const clientesTableBody = document.querySelector('#clientesTable tbody');
    const cpfInput = document.getElementById('cpf');

    // Máscara CPF
    cpfInput.addEventListener('input', (e) => {

        let value = e.target.value;

        // Remove tudo que não for número
        value = value.replace(/\D/g, '');

        // Limita para 11 números
        value = value.substring(0, 11);

        // Adiciona pontos e traço
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        e.target.value = value;
    });

    // Carregar clientes do localStorage
    function loadClientes() {

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        clientesTableBody.innerHTML = '';

        clientes.forEach(cliente => {
            addClienteToTable(cliente);
        });
    }

    // Adicionar cliente na tabela
    function addClienteToTable(cliente) {

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.idade}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.email}</td>
            <td>${cliente.sexo}</td>
            <td>
                <button onclick="editCliente('${cliente.id}')">
                    Editar
                </button>

                <button onclick="deleteCliente('${cliente.id}')">
                    Excluir
                </button>
            </td>
        `;

        clientesTableBody.appendChild(row);
    }

    // Salvar cliente
    function saveCliente(cliente) {

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        const index = clientes.findIndex(c => c.id === cliente.id);

        if (index === -1) {
            clientes.push(cliente);
        } else {
            clientes[index] = cliente;
        }

        localStorage.setItem('clientes', JSON.stringify(clientes));

        loadClientes();
    }

    // Deletar cliente
    window.deleteCliente = function(id) {

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        const filteredClientes = clientes.filter(cliente => cliente.id !== id);

        localStorage.setItem('clientes', JSON.stringify(filteredClientes));

        loadClientes();
    }

    // Editar cliente
    window.editCliente = function(id) {

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        const cliente = clientes.find(cliente => cliente.id === id);

        if (cliente) {

            document.getElementById('clienteId').value = cliente.id;
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('idade').value = cliente.idade;
            document.getElementById('cpf').value = cliente.cpf;
            document.getElementById('email').value = cliente.email;
            document.getElementById('sexo').value = cliente.sexo;
        }
    }

    // Envio do formulário
    clienteForm.addEventListener('submit', event => {

        event.preventDefault();

        const id =
            document.getElementById('clienteId').value ||
            new Date().getTime().toString();

        const nome = document.getElementById('nome').value;

        const idade = parseInt(
            document.getElementById('idade').value
        );

        const cpf = document.getElementById('cpf').value;

        const email = document.getElementById('email').value;

        const sexo = document.getElementById('sexo').value;

        // Remove símbolos do CPF
        const cpfLimpo = cpf.replace(/\D/g, '');

        // Validação CPF
        if (cpfLimpo.length !== 11) {

            alert('O CPF deve ter 11 números.');

            return;
        }

        // Validação idade
        if (idade < 1 || idade > 100) {

            alert('A idade deve ser entre 1 e 100 anos.');

            return;
        }

        const cliente = {
            id,
            nome,
            idade,
            cpf,
            email,
            sexo
        };

        saveCliente(cliente);

        clienteForm.reset();
    });

    loadClientes();

});