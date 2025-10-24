/*
  # Adicionar CPF aos clientes

  1. Alterações
    - Adiciona coluna `cpf` na tabela `customers`
      - Tipo: text
      - Constraint: unique (CPF único por cliente)
      - Validação: apenas números, 11 dígitos

  2. Notas
    - CPF deve ser armazenado sem formatação (apenas números)
    - Validação de formato deve ser feita no frontend
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'cpf'
  ) THEN
    ALTER TABLE customers ADD COLUMN cpf text;
    
    CREATE UNIQUE INDEX IF NOT EXISTS customers_cpf_key ON customers(cpf);
    
    ALTER TABLE customers ADD CONSTRAINT customers_cpf_check 
      CHECK (cpf IS NULL OR (cpf ~ '^[0-9]{11}$'));
  END IF;
END $$;
