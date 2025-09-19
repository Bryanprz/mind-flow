class CreateSolidQueueTables < ActiveRecord::Migration[7.1]
  def change
    create_table :solid_queue_jobs do |t|
      t.string :queue_name, null: false
      t.string :class_name, null: false
      t.text :arguments
      t.integer :priority, default: 0, null: false
      t.datetime :scheduled_at
      t.datetime :finished_at
      t.string :concurrency_key
      t.timestamps

      t.index [ :queue_name, :priority, :id ], name: :index_solid_queue_jobs_on_queue_name_and_priority_and_id
      t.index [ :scheduled_at, :priority, :id ], name: :index_solid_queue_jobs_on_scheduled_at_and_priority_and_id
      t.index [ :concurrency_key ], name: :index_solid_queue_jobs_on_concurrency_key
    end

    create_table :solid_queue_blocked_executions do |t|
      t.references :job, null: false, index: { unique: true }
      t.string :concurrency_key, null: false
      t.datetime :expires_at, null: false
      t.timestamps

      t.index [ :expires_at, :concurrency_key ], name: :idx_sq_blocked_exec_expires_concurrency
    end

    create_table :solid_queue_claimed_executions do |t|
      t.references :job, null: false, index: { unique: true }
      t.bigint :process_id, null: false
      t.datetime :expires_at, null: false
      t.timestamps

      t.index [ :process_id, :expires_at ], name: :idx_sq_claimed_exec_proc_exp
    end

    create_table :solid_queue_failed_executions do |t|
      t.references :job, null: false, index: { unique: true }
      t.text :error
      t.timestamps
    end

    create_table :solid_queue_ready_executions do |t|
      t.references :job, null: false, index: { unique: true }
      t.string :queue_name, null: false
      t.integer :priority, default: 0, null: false
      t.timestamps

      t.index [ :queue_name, :priority, :job_id ], name: :index_solid_queue_ready_executions_on_queue_name_and_priority_and_job
    end

    create_table :solid_queue_recurring_executions do |t|
      t.references :job, null: false, index: { unique: true }
      t.string :task_key, null: false
      t.datetime :run_at, null: false
      t.timestamps

      t.index [ :task_key, :run_at ], name: :index_solid_queue_recurring_executions_on_task_key_and_run_at
    end

    create_table :solid_queue_scheduled_executions do |t|
      t.references :job, null: false, index: { unique: true }
      t.string :queue_name, null: false
      t.integer :priority, default: 0, null: false
      t.datetime :scheduled_at, null: false
      t.timestamps

      t.index [ :scheduled_at, :priority, :job_id ], name: :index_solid_queue_scheduled_executions_on_scheduled_at_and_priority_and_job
    end
  end
end
