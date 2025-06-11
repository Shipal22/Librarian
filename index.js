const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
const studentModel = require('./studentmodule');


app.get('/', (req, res) => {
   res.render('index');
});


app.get('/:adm_no/borrow', (req, res) => {
   res.render('borrow',{adm_no :req.params.adm_no});
});

app.get('/:adm_no/return', async(req, res) => {
   const std_details = await studentModel.findOne({adm_no : req.params.adm_no});
   res.render('return',{adm_no :req.params.adm_no ,std_details});
});


app.post('/details', async (req, res) => {
  
   const found = await studentModel.findOne({adm_no: req.body.adm_no});
   if (!found){
   const student = await studentModel.create(
   {
      adm_no: req.body.adm_no,
      email: req.body.email,
      books_borrowed : [],
   })
   await student.save();
   };
    res.redirect(`/${req.body.adm_no}/mainpage`);

});


app.get('/:adm_no/mainpage' ,  async (req, res) => {
   const student = await studentModel.findOne({adm_no :req.params.adm_no});
   if (student){
   const size = student.books_borrowed.length;
   res.render('mainpage' , {Adm:student.adm_no,size});
   }
}
)

app.post('/:adm_no/submit-barcode', async (req, res) => {
  const { code, format } = req.body;
    const student = await studentModel.findOne({ adm_no: req.params.adm_no });

    if (!student) return res.status(404).send("Student not found");
      student.books_borrowed.push({ isbn: code ,name :req.body.book_name, author:req.body.book_author});
      await student.save();
    
    res.send("Book saved successfully");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
