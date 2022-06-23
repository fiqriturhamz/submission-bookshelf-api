const books = require("./books");
const {
    nanoid
} = require('nanoid');

//menambahkan buku
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response
    }


    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;


    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;

    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;

};



//menampilkan isi buku
const getAllBooksHandler = (request, h) => {
    const {
        name,
        reading,
        finished
    } = request.query;


    if (name) {
        const book = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        const response = h.response({
            status: "success",
            books: book.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        });
        response.code(200);
        return response;
    }


    if (reading) {
        const book = books.filter((book) => Number(book.reading) === Number(reading));
        const response = h.response({
            status: "success",
            data: {
                books: book.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }


    if (finished) {
        const book = books.filter((book) => Number(book.finished) === Number(finished));
        const response = h.response({
            status: "success",
            data: {
                books: book.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "success",
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            })),
        }
    });
    response.code(200);
    return response;

};


//menampilkan isi buku berdasarkan ID
const getBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;
    const book = books.filter((n) => n.id === id)[0]

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

//mengubah data buku
const editBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    const index = books.findIndex((book) => book.id === id);

    if (name === undefined) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (index === -1) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        });
        response.code(404);
        return response;
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,

        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    };

}

//menghapus buku
const deleteBookByIdHandler = (request, h) => {

    const {
        id
    } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',

        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: "Buku gagal dihapus. Id tidak ditemukan",

    });
    response.code(404);
    return response;
};
module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};