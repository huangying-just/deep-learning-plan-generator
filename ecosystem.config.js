module.exports = {
  apps: [
    {
      name: 'deep-learning-plan-generator',
      script: 'npm',
      args: 'run start:prod',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      // 日志配置
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 自动重启配置
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // 健康检查
      health_check_grace_period: 3000,
      health_check_interval: 30000,
    }
  ]
}; 