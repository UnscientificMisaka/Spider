const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ChoiceSchema = new Schema({
    question: { type: String },
    options: { type: Array },
    answer: { type: Array },
    analysis: { type: String ,default: '暂无推荐解答'},// 题解
    job: { type: String },
    language: { type: String },  
    tags: { type: Array },// 涉及到的知识点
    kind : { type: String },
    company: { type: Array },
    create_at: { type: Date, default: Date.now() },
    update_at: { type: Date, default: Date.now() },
    
    create_who: { type: Schema.ObjectId },
    update_who: { type: Schema.ObjectId },

    do_count: { type: Number, default: 0 },// 做题量
    collect_count: { type: Number, default: 0 },// 收藏量    

});

ChoiceSchema.pre('save',(next) => {
    this.update_at = new Date();
    next();
})

mongoose.model('Choice', ChoiceSchema);
