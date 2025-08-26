import Question from './question.model.js'


export const addQuestion = async (req, res) => {
  try {
    let data = req.body
    let question = new Question(data)

    await question.save()

    return res.send({
      success: true,
      message: 'Question created successfully',
      question
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'General error creating Question',
      err
    })
  }
}


export const getAllQuestions = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query
    const questions = await Question.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    if (questions.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'Questions not found'
      })
    }

    return res.send({
      success: true,
      message: 'Questions found',
      questions
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'General error getting Questions',
      err
    })
  }
}


export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params
    const question = await Question.findById(id).populate('category', 'name')

    if (!question) {
      return res.status(404).send({
        success: false,
        message: 'Question not found'
      })
    }

    return res.send({
      success: true,
      message: 'Question found',
      question
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'General error getting Question',
      err
    })
  }
}


export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const question = await Question.findByIdAndUpdate(id, data, { new: true })

    if (!question) {
      return res.status(404).send({
        success: false,
        message: 'Question not found'
      })
    }

    return res.send({
      success: true,
      message: 'Question updated successfully',
      question
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'General error updating Question',
      err
    })
  }
}


export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const question = await Question.findByIdAndDelete(id)

    if (!question) {
      return res.status(404).send({
        success: false,
        message: 'Question not found'
      })
    }

    return res.send({
      success: true,
      message: 'Question deleted successfully'
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({
      success: false,
      message: 'General error deleting Question',
      err
    })
  }
}
