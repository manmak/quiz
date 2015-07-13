var models = require('../models/models.js');

// GET /quizes/statistics
exports.index = function(req, res, next) {
	var statistics = {
		quizes: 0,
		comments: 0,
		avg_comments: 0,
		with_comments: 0,
		without_comments: 0
	};

	models.Quiz.count()
	.then(function(quizes) {
		statistics.quizes = quizes;
		return models.Comment.count({ where: { publicado: true } }); })
	.then(function(comments) {
		statistics.comments = comments;
		return models.Quiz.count({
			distinct: 'id',
			include: [{ model: models.Comment, required: true, where: { publicado: true } }]}); })
	.then(function(with_comments) {
		statistics.with_comments = with_comments;
		return statistics.quizes - statistics.with_comments; })
	.then(function(without_comments) {
		statistics.without_comments = without_comments;
		statistics.avg_comments = statistics.quizes ?
			Math.round( statistics.comments / statistics.quizes * 100) / 100
			: 0;
		res.render('statistics/index', {statistics: statistics, errors: []});
	}).catch(function(error) {next(error);});
};