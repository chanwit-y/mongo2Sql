# Mongo2SQL 🔄

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![SQL](https://img.shields.io/badge/SQL-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)](https://www.mysql.com/)

> Convert MongoDB aggregation pipelines to SQL queries with ease! 🚀

## Overview 📋

This project helps developers translate MongoDB aggregation pipelines into equivalent SQL queries. Perfect for:

- ✅ Database migration projects
- ✅ Cross-database compatibility
- ✅ Learning SQL equivalents of MongoDB operations
- ✅ Documentation and reference

## Features ⭐

- 📊 Converts MongoDB `$match` to SQL `WHERE` clauses
- 🔄 Translates `$lookup` to SQL `JOIN` operations  
- 🔍 Handles `$unwind` for flattening arrays
- 📝 Supports `$addFields` operations
- 🧩 Preserves complex query structures

## Installation 💻

```bash
# Clone the repository
git clone https://github.com/yourusername/mongo2sql.git

# Navigate to the project
cd mongo2sql

# Install dependencies
bun install
```

## Usage 🛠️

```bash
# Run the project
bun run index.ts
```

## Test Cases 📑

See [test case.md](./test%20case.md) for comprehensive examples of MongoDB to SQL conversions, including:

- 📊 Simple filtering queries
- 🔄 Complex joins with multiple collections
- 🔍 Nested lookups
- 📝 Field transformations

## Development 👨‍💻

```bash
# Run the development server
bun run dev

# Run tests
bun test
```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- MongoDB Documentation
- SQL standard references
- All contributors who help improve this tool

---

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.