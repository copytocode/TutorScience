import { type User, type InsertUser, type Topic, type Lesson, type Exercise, type Progress, type ExerciseAttempt, type TopicProgress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Topic methods
  getAllTopics(): Promise<Topic[]>;
  getTopic(id: string): Promise<Topic | undefined>;
  getTopicsBySubject(subject: string): Promise<Topic[]>;
  getTopicsByLevel(level: string): Promise<Topic[]>;

  // Lesson methods
  getLesson(id: string): Promise<Lesson | undefined>;
  getLessonsByTopic(topicId: string): Promise<Lesson[]>;

  // Exercise methods
  getExercise(id: string): Promise<Exercise | undefined>;
  getExercisesByLesson(lessonId: string): Promise<Exercise[]>;

  // Progress methods (session-based)
  recordExerciseAttempt(attempt: ExerciseAttempt): Promise<void>;
  getSessionScore(): Promise<number>;
  markLessonComplete(lessonId: string, topicId: string): Promise<void>;
  isLessonComplete(lessonId: string): Promise<boolean>;
  getTopicProgress(topicId: string): Promise<TopicProgress>;
  getAllProgress(): Promise<Progress[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private topics: Map<string, Topic>;
  private lessons: Map<string, Lesson>;
  private exercises: Map<string, Exercise>;
  private exerciseAttempts: ExerciseAttempt[];
  private progress: Map<string, Progress>;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.lessons = new Map();
    this.exercises = new Map();
    this.exerciseAttempts = [];
    this.progress = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed Topics
    const topics: Topic[] = [
      // KS3 Topics
      { id: '1', title: 'Cells and Organisation', subject: 'biology', level: 'ks3', description: 'Learn about cells, tissues, organs, and organ systems', lessonCount: 3 },
      { id: '2', title: 'States of Matter', subject: 'chemistry', level: 'ks3', description: 'Understand solids, liquids, gases, and changes of state', lessonCount: 2 },
      { id: '3', title: 'Forces and Motion', subject: 'physics', level: 'ks3', description: 'Explore forces, speed, and acceleration', lessonCount: 3 },
      { id: '4', title: 'Reproduction', subject: 'biology', level: 'ks3', description: 'Study plant and animal reproduction', lessonCount: 2 },
      { id: '5', title: 'Atoms and Elements', subject: 'chemistry', level: 'ks3', description: 'Discover the periodic table and atomic structure', lessonCount: 3 },
      
      // GCSE Topics
      { id: '6', title: 'Photosynthesis', subject: 'biology', level: 'gcse', description: 'Understand how plants make food using light energy', lessonCount: 3 },
      { id: '7', title: 'Chemical Reactions', subject: 'chemistry', level: 'gcse', description: 'Learn about different types of chemical reactions', lessonCount: 4 },
      { id: '8', title: 'Electricity and Circuits', subject: 'physics', level: 'gcse', description: 'Master electric current, voltage, and resistance', lessonCount: 4 },
      { id: '9', title: 'Cell Division', subject: 'biology', level: 'gcse', description: 'Explore mitosis and meiosis', lessonCount: 2 },
      { id: '10', title: 'Energy Changes', subject: 'chemistry', level: 'gcse', description: 'Study exothermic and endothermic reactions', lessonCount: 3 },
      
      // A-Level Topics
      { id: '11', title: 'DNA and Protein Synthesis', subject: 'biology', level: 'a-level', description: 'Deep dive into genetics and molecular biology', lessonCount: 4 },
      { id: '12', title: 'Organic Chemistry', subject: 'chemistry', level: 'a-level', description: 'Study carbon compounds and functional groups', lessonCount: 5 },
      { id: '13', title: 'Quantum Physics', subject: 'physics', level: 'a-level', description: 'Explore the quantum world and wave-particle duality', lessonCount: 4 },
      { id: '14', title: 'Ecosystems', subject: 'biology', level: 'a-level', description: 'Analyze energy flow and nutrient cycles', lessonCount: 3 },
      { id: '15', title: 'Equilibria', subject: 'chemistry', level: 'a-level', description: 'Master dynamic equilibrium and Le Chatelier\'s principle', lessonCount: 3 },
    ];

    topics.forEach(topic => this.topics.set(topic.id, topic));

    // Seed Lessons for Topic 1: Cells and Organisation
    const lessons1: Lesson[] = [
      { id: 'l1', topicId: '1', title: 'What are Cells?', content: '<h2>Introduction to Cells</h2><p>Cells are the basic building blocks of all living organisms. Every living thing, from the smallest bacterium to the largest whale, is made up of cells.</p><h3>Types of Cells</h3><p>There are two main types of cells:</p><ul><li><strong>Prokaryotic cells</strong> - Simple cells without a nucleus (e.g., bacteria)</li><li><strong>Eukaryotic cells</strong> - Complex cells with a nucleus (e.g., animal and plant cells)</li></ul><h3>Key Cell Structures</h3><p>Most cells contain:</p><ul><li><strong>Cell membrane</strong> - Controls what enters and exits the cell</li><li><strong>Cytoplasm</strong> - Jelly-like substance where chemical reactions occur</li><li><strong>Nucleus</strong> - Contains genetic information (DNA)</li><li><strong>Mitochondria</strong> - Produces energy through respiration</li></ul>', order: 0, hasExercises: true },
      { id: 'l2', topicId: '1', title: 'Tissues and Organs', content: '<h2>From Cells to Systems</h2><p>Cells work together in groups to form more complex structures.</p><h3>Hierarchy of Organisation</h3><ol><li><strong>Cells</strong> - Basic units of life</li><li><strong>Tissues</strong> - Groups of similar cells working together</li><li><strong>Organs</strong> - Groups of tissues performing specific functions</li><li><strong>Organ Systems</strong> - Groups of organs working together</li></ol><h3>Examples of Tissues</h3><ul><li><strong>Epithelial tissue</strong> - Covers body surfaces</li><li><strong>Muscle tissue</strong> - Enables movement</li><li><strong>Nervous tissue</strong> - Carries signals</li></ul>', order: 1, hasExercises: true },
      { id: 'l3', topicId: '1', title: 'Specialised Cells', content: '<h2>Cell Specialisation</h2><p>Different cells are adapted for specific functions through specialisation.</p><h3>Examples of Specialised Cells</h3><p><strong>Red Blood Cells</strong></p><ul><li>No nucleus - more space for haemoglobin</li><li>Biconcave shape - larger surface area for oxygen absorption</li></ul><p><strong>Nerve Cells</strong></p><ul><li>Long axon - carries electrical signals over long distances</li><li>Dendrites - receive signals from other cells</li></ul><p><strong>Root Hair Cells</strong></p><ul><li>Long extension - increases surface area for water absorption</li><li>Thin walls - easier water movement</li></ul>', order: 2, hasExercises: false },
    ];

    lessons1.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Seed Exercises for Lesson 1
    const exercises1: Exercise[] = [
      { id: 'e1', lessonId: 'l1', question: 'What is the function of the cell membrane?', type: 'multiple-choice', options: ['To produce energy', 'To control what enters and exits the cell', 'To store genetic information', 'To make proteins'], correctAnswer: 'To control what enters and exits the cell', explanation: 'The cell membrane acts as a barrier and controls the movement of substances in and out of the cell.', order: 0 },
      { id: 'e2', lessonId: 'l1', question: 'Prokaryotic cells have a nucleus.', type: 'true-false', correctAnswer: 'false', explanation: 'Prokaryotic cells are simple cells that do not have a nucleus. Their DNA floats freely in the cytoplasm.', order: 1 },
      { id: 'e3', lessonId: 'l1', question: 'Which organelle produces energy for the cell?', type: 'short-answer', correctAnswer: 'mitochondria', explanation: 'Mitochondria are known as the powerhouse of the cell. They produce energy (ATP) through cellular respiration.', order: 2 },
    ];

    exercises1.forEach(exercise => this.exercises.set(exercise.id, exercise));

    // Seed Exercises for Lesson 2
    const exercises2: Exercise[] = [
      { id: 'e4', lessonId: 'l2', question: 'What is a group of similar cells working together called?', type: 'multiple-choice', options: ['An organ', 'A tissue', 'A system', 'An organism'], correctAnswer: 'A tissue', explanation: 'A tissue is formed when similar cells group together to perform a specific function.', order: 0 },
      { id: 'e5', lessonId: 'l2', question: 'The correct order of biological organisation is: cells → tissues → organs → organ systems.', type: 'true-false', correctAnswer: 'true', explanation: 'This is the correct hierarchy showing how cells organise into increasingly complex structures.', order: 1 },
    ];

    exercises2.forEach(exercise => this.exercises.set(exercise.id, exercise));

    // Seed Lessons for Topic 6: Photosynthesis
    const lessons6: Lesson[] = [
      { id: 'l6', topicId: '6', title: 'Introduction to Photosynthesis', content: '<h2>What is Photosynthesis?</h2><p>Photosynthesis is the process by which plants make their own food using light energy.</p><h3>The Photosynthesis Equation</h3><p>Carbon dioxide + Water → Glucose + Oxygen</p><p>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</p><h3>Why is Photosynthesis Important?</h3><ul><li>Produces oxygen for respiration</li><li>Converts light energy into chemical energy</li><li>Forms the base of food chains</li><li>Removes carbon dioxide from the atmosphere</li></ul>', order: 0, hasExercises: true },
      { id: 'l7', topicId: '6', title: 'Factors Affecting Photosynthesis', content: '<h2>Limiting Factors</h2><p>Several factors can limit the rate of photosynthesis:</p><h3>Light Intensity</h3><p>As light intensity increases, the rate of photosynthesis increases up to a certain point.</p><h3>Carbon Dioxide Concentration</h3><p>Higher CO₂ levels increase photosynthesis rate until another factor becomes limiting.</p><h3>Temperature</h3><p>Photosynthesis involves enzymes, which work best at optimal temperatures (usually around 25-35°C).</p><h3>Chlorophyll Content</h3><p>More chlorophyll means more light can be absorbed for photosynthesis.</p>', order: 1, hasExercises: true },
      { id: 'l8', topicId: '6', title: 'Uses of Glucose', content: '<h2>How Plants Use Glucose</h2><p>The glucose produced during photosynthesis can be used in several ways:</p><ul><li><strong>Respiration</strong> - Broken down to release energy</li><li><strong>Storage</strong> - Converted to starch for storage</li><li><strong>Cell walls</strong> - Converted to cellulose for strengthening cell walls</li><li><strong>Proteins</strong> - Combined with nitrates to make amino acids and proteins</li><li><strong>Fats and oils</strong> - Converted for storage in seeds</li></ul>', order: 2, hasExercises: true },
    ];

    lessons6.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Seed Exercises for Lesson 6
    const exercises6: Exercise[] = [
      { id: 'e6', lessonId: 'l6', question: 'What are the products of photosynthesis?', type: 'multiple-choice', options: ['Carbon dioxide and water', 'Glucose and oxygen', 'Glucose and carbon dioxide', 'Water and oxygen'], correctAnswer: 'Glucose and oxygen', explanation: 'Photosynthesis produces glucose (food for the plant) and oxygen (released as a by-product).', order: 0 },
      { id: 'e7', lessonId: 'l6', question: 'Photosynthesis occurs in all plant cells.', type: 'true-false', correctAnswer: 'false', explanation: 'Photosynthesis mainly occurs in cells containing chloroplasts, typically in the leaves and green stems.', order: 1 },
    ];

    exercises6.forEach(exercise => this.exercises.set(exercise.id, exercise));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Topic methods
  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values()).sort((a, b) => {
      if (a.level !== b.level) {
        const levelOrder = { 'ks3': 0, 'gcse': 1, 'a-level': 2 };
        return levelOrder[a.level] - levelOrder[b.level];
      }
      return a.subject.localeCompare(b.subject);
    });
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async getTopicsBySubject(subject: string): Promise<Topic[]> {
    return Array.from(this.topics.values()).filter(
      (topic) => topic.subject === subject
    );
  }

  async getTopicsByLevel(level: string): Promise<Topic[]> {
    return Array.from(this.topics.values()).filter(
      (topic) => topic.level === level
    );
  }

  // Lesson methods
  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessonsByTopic(topicId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter((lesson) => lesson.topicId === topicId)
      .sort((a, b) => a.order - b.order);
  }

  // Exercise methods
  async getExercise(id: string): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getExercisesByLesson(lessonId: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter((exercise) => exercise.lessonId === lessonId)
      .sort((a, b) => a.order - b.order);
  }

  // Progress methods
  async recordExerciseAttempt(attempt: ExerciseAttempt): Promise<void> {
    this.exerciseAttempts.push(attempt);
  }

  async getSessionScore(): Promise<number> {
    const correctAttempts = this.exerciseAttempts.filter(a => a.isCorrect).length;
    return correctAttempts;
  }

  async markLessonComplete(lessonId: string, topicId: string): Promise<void> {
    const key = `${topicId}-${lessonId}`;
    this.progress.set(key, {
      topicId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    });
  }

  async isLessonComplete(lessonId: string): Promise<boolean> {
    for (const progress of this.progress.values()) {
      if (progress.lessonId === lessonId && progress.completed) {
        return true;
      }
    }
    return false;
  }

  async getTopicProgress(topicId: string): Promise<TopicProgress> {
    const lessons = await this.getLessonsByTopic(topicId);
    const completedLessons = Array.from(this.progress.values()).filter(
      p => p.topicId === topicId && p.completed
    ).length;

    const allExercises = (await Promise.all(
      lessons.map(l => this.getExercisesByLesson(l.id))
    )).flat();

    const exerciseIds = new Set(allExercises.map(e => e.id));
    const exercisesCompleted = this.exerciseAttempts.filter(
      a => exerciseIds.has(a.exerciseId)
    ).length;

    const correctAttempts = this.exerciseAttempts.filter(
      a => exerciseIds.has(a.exerciseId) && a.isCorrect
    ).length;

    const averageScore = exercisesCompleted > 0 
      ? (correctAttempts / exercisesCompleted) * 100 
      : undefined;

    return {
      topicId,
      completedLessons,
      totalLessons: lessons.length,
      exercisesCompleted,
      totalExercises: allExercises.length,
      averageScore,
    };
  }

  async getAllProgress(): Promise<Progress[]> {
    return Array.from(this.progress.values());
  }
}

export const storage = new MemStorage();
