r.dbCreate('todolist');

r.db('todolist').tableCreate('tasks');

r.db('todolist').table('tasks').insert({task: 'Finalizar Testes', status: 'Concluido', data: '09/03/2017'});